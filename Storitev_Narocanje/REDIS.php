<?php
require 'vendor/autoload.php';

// Set execution time limits
set_time_limit(0);
ini_set('max_execution_time', 0);

$logFile = __DIR__ . '/listener.log';

function logMessage($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
    echo "$message\n";
}

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

        logMessage("📦 Poslušam nova naročila...");

        $lastPing = time();
        foreach ($pubsub as $message) {
            if (time() - $lastPing > 30) {
                $redis->ping();
                $lastPing = time();
            }

            if ($message->kind === 'message') {
                $data = json_decode($message->payload, true);
                logMessage("📢 Novo naročilo prejeto: {$data['part_name']} (x{$data['quantity']}) part:no ({$data['part_no']})");

                $partName = urlencode($data['part_no']);

                $curl = curl_init();
                curl_setopt($curl, CURLOPT_URL, "http://zaloga:3000/parts/$partName");
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($curl, CURLOPT_TIMEOUT, 5);
                curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

                $response = curl_exec($curl);
                $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

                if (curl_errno($curl)) {
                    logMessage("❌ cURL Error: " . curl_error($curl));
                    curl_close($curl);
                    continue;
                }
                curl_close($curl);

                if ($httpCode != 200) {
                    logMessage("❌ Napaka pri pridobivanju podatkov o zalogi. HTTP Code: $httpCode");
                    continue;
                }

                $stockData = json_decode($response, true);

                if ($stockData && isset($stockData['stock']) && $stockData['stock'] >= $data['quantity']) {
                    $stmt = $pdo->prepare("UPDATE orders SET status = 'confirmed' WHERE id = ?");
                    $stmt->execute([$data['order_id']]);

                    logMessage("✅ Naročilo #{$data['order_id']} potrjeno!");
                } else {
                    $stmt = $pdo->prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?");
                    $stmt->execute([$data['order_id']]);

                    $stockLevel = $stockData['stock'] ?? 0;
                    logMessage("❌ Naročilo #{$data['order_id']} ni potrjeno, zaloga je premajhna! (Na voljo: $stockLevel, Zahtevano: {$data['quantity']})");
                }
            }
        }
    } catch (Predis\Connection\ConnectionException $e) {
        logMessage("❌ Redis connection error: " . $e->getMessage());
        logMessage("♻️ Poskušam ponovno vzpostaviti povezavo v 5 sekundah...");
        sleep(5);
    } catch (PDOException $e) {
        logMessage("❌ MySQL connection error: " . $e->getMessage());
        logMessage("♻️ Poskušam ponovno vzpostaviti povezavo v 5 sekundah...");
        sleep(5);
    } catch (Exception $e) {
        logMessage("❌ Unexpected error: " . $e->getMessage());
        logMessage("♻️ Poskušam znova v 5 sekundah...");
        sleep(5);
    }
}
?>