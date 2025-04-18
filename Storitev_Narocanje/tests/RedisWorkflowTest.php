
<?php
require __DIR__ . '/../vendor/autoload.php';
use PHPUnit\Framework\TestCase;
use Predis\Client;

class RedisWorkflowTest extends TestCase
{
   private Client $redis;

    protected function setUp(): void
    {
        $this->redis = new Client([
            'scheme' => 'tcp',
            'host'   => 'localhost',
            'port'   => 6379,
        ]);
    }

    public function testPublishAndReceiveOrderViaRedis()
    {
        $channel = 'new_orders';
        $testOrder = [
            'order_id' => 999,
            'part_name' => 'test_part',
            'quantity' => 1,
            'part_no' => 'TP-001'
        ];

        $receivedMessage = null;

        // Start subscriber in parallel
        $pid = pcntl_fork();
        if ($pid == -1) {
            $this->fail("Failed to fork process.");
        } elseif ($pid === 0) {
            // Child process: subscribe
            $redisSub = new Client([
                'scheme' => 'tcp',
                'host'   => 'localhost',
                'port'   => 6379,
            ]);
            $pubsub = $redisSub->pubSubLoop();
            $pubsub->subscribe($channel);

            foreach ($pubsub as $message) {
                if ($message->kind === 'message') {
                    file_put_contents('/tmp/redis_test_output.json', $message->payload);
                    break;
                }
            }
            exit(0);
        } else {
            // Parent process: publish after delay
            sleep(1); // wait for subscriber to connect
            $this->redis->publish($channel, json_encode($testOrder));
            sleep(2); // give time for subscriber to receive
            $output = file_get_contents('/tmp/redis_test_output.json');

            $receivedMessage = json_decode($output, true);

            // Cleanup child process
            pcntl_wait($status);
        }

        $this->assertNotNull($receivedMessage, "Message was not received.");
        $this->assertEquals($testOrder['order_id'], $receivedMessage['order_id']);
        $this->assertEquals($testOrder['part_name'], $receivedMessage['part_name']);
    }
}?>