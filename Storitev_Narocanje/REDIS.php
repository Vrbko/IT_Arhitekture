<?php
require 'vendor/autoload.php';

// Set execution time limits
set_time_limit(0);
ini_set('max_execution_time', 0);

function createRedisClient() {
    return new Predis\Client([
        'scheme' => 'tcp',
        'host'   => 'redis',
        'port'   => 6379,
        'read_write_timeout' => -1,
        'timeout' => -1,
        'parameters' => [
            'tcp_keepalive' => 60,
        ],
    ]);
}

function createPdoConnection() {
    return new PDO('mysql:host=mysql-db;dbname=autodeli', 'root', 'vrbko');
}

// Main loop with reconnection logic
while (true) {
    try {
        $redis = createRedisClient();
        $pdo = createPdoConnection();
        
        $pubsub = $redis->pubSubLoop();
        $pubsub->subscribe('new_orders');

        echo "📦 Poslušam nova naročila...\n";

        $lastPing = time();
        foreach ($pubsub as $message) {
            // Ping Redis every 30 seconds to keep connection alive
            if (time() - $lastPing > 30) {
                $redis->ping();
                $lastPing = time();
            }

            if ($message->kind === 'message') {
                $data = json_decode($message->payload, true);
                echo "📢 Novo naročilo prejeto: {$data['part_name']} (x{$data['quantity']}) part:no ({$data['part_no']})\n";

                // Call REST API to check stock availability
                $partName = urlencode($data['part_no']);

                // cURL options
                $curl = curl_init();
                curl_setopt($curl, CURLOPT_URL, "http://zaloga:3000/parts/$partName");
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($curl, CURLOPT_TIMEOUT, 5);  // 5 seconds timeout
                curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

                // Execute cURL request
                $response = curl_exec($curl);
                $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
                
                if (curl_errno($curl)) {
                    echo "❌ cURL Error: " . curl_error($curl) . "\n";
                    curl_close($curl);
                    continue;
                }
                curl_close($curl);

                // Handle errors in REST API response
                if ($httpCode != 200) {
                    echo "❌ Napaka pri pridobivanju podatkov o zalogi. HTTP Code: $httpCode\n";
                    continue;
                }

                $stockData = json_decode($response, true);

                // Check stock availability
                if ($stockData && isset($stockData['stock']) && $stockData['stock'] >= $data['quantity']) {
                    // Update order status to confirmed in MySQL
                    $stmt = $pdo->prepare("UPDATE orders SET status = 'confirmed' WHERE id = ?");
                    $stmt->execute([$data['order_id']]);

                    echo "✅ Naročilo #{$data['order_id']} potrjeno!\n";
                } else {
                    // Update order status to cancelled in MySQL
                    $stmt = $pdo->prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?");
                    $stmt->execute([$data['order_id']]);

                    $stockLevel = $stockData['stock'] ?? 0;
                    echo "❌ Naročilo #{$data['order_id']} ni potrjeno, zaloga je premajhna! (Na voljo: $stockLevel, Zahtevano: {$data['quantity']})\n";
                }
            }
        }
    } catch (Predis\Connection\ConnectionException $e) {
        echo "❌ Redis connection error: " . $e->getMessage() . "\n";
        echo "♻️ Poskušam ponovno vzpostaviti povezavo v 5 sekundah...\n";
        sleep(5);
    } catch (PDOException $e) {
        echo "❌ MySQL connection error: " . $e->getMessage() . "\n";
        echo "♻️ Poskušam ponovno vzpostaviti povezavo v 5 sekundah...\n";
        sleep(5);
    } catch (Exception $e) {
        echo "❌ Unexpected error: " . $e->getMessage() . "\n";
        echo "♻️ Poskušam znova v 5 sekundah...\n";
        sleep(5);
    }
}
?>