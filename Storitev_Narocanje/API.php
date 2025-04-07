<?php
require 'vendor/autoload.php';

$redis = new Predis\Client([
    'scheme' => 'tcp',
    'host'   => 'redis',
    'port'   => 6379,
    'read_write_timeout' => -1,
    'timeout' => -1,
    'parameters' => [
        'tcp_keepalive' => 60,
    ],
]);
$pdo = new PDO('mysql:host=mysql-db;dbname=autodeli', 'root', 'vrbko');


// Preberi podatke iz HTTP zahteve
$data = json_decode(file_get_contents("php://input"), true);

if (!$data['part_name'] || !$data['quantity'] || !$data['part_no']) {
    echo json_encode(["error" => "Manjkajo podatki"]);
    exit;
}

// Shranimo naročilo v MySQL
$stmt = $pdo->prepare("INSERT INTO orders (part_name, quantity, part_no, status) VALUES (?, ?, ?, 'pending')");
$stmt->execute([$data['part_name'], $data['quantity'], $data['part_no']]);
$orderId = $pdo->lastInsertId();

// Objavi sporočilo v RedisKak
$redis->publish('new_orders', json_encode([
    'order_id' => $orderId,
    'part_name' => $data['part_name'],
    'quantity' => $data['quantity'],
    'part_no' => $data['part_no']
]));

echo json_encode(["message" => "Naročilo oddano!", "order_id" => $orderId , "data " => $data]);
?>