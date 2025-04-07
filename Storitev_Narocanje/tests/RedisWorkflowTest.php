
<?php
require __DIR__ . '/../vendor/autoload.php';
use PHPUnit\Framework\TestCase;
use Predis\Client;

class RedisWorkflowTest extends TestCase
{
    private $redis;

    protected function setUp(): void
    {
        $this->redis = new Client([
            'scheme' => 'tcp',
            'host'   => "localhost",
            'port'   => 6379,
        ]);
    }

    protected function tearDown(): void
    {
        // Clean up any Redis data after each test
        $this->redis->flushdb();
    }

    public function testWriteAndReadFromRedis(): void
    {
        // Simulate a write operation to Redis
        $this->redis->set('test-key', 'Hello, Redis!');
        
        // Simulate a read operation from Redis
        $value = $this->redis->get('test-key');
        
        // Assert that the value retrieved is correct
        $this->assertEquals('Hello, Redis!', $value);
    }

    public function testDeleteKeyFromRedis(): void
    {
        // Write a key to Redis
        $this->redis->set('test-delete-key', 'Delete Me');
        
        // Delete the key
        $this->redis->del('test-delete-key');
        
        // Assert that the key is deleted by checking if the value is null
        $value = $this->redis->get('test-delete-key');
        $this->assertNull($value);  // Use assertNull to check that the key doesn't exist anymore
    }

    public function testTransaction(): void
    {
        // Start a Redis transaction
        $this->redis->multi();

        // Perform a series of commands within the transaction
        $this->redis->set('trans-key1', 'Value 1');
        $this->redis->set('trans-key2', 'Value 2');
        
        // Execute the transaction
        $responses = $this->redis->exec();
        
        // Assert that the responses are as expected
        $this->assertCount(2, $responses);
        $this->assertEquals('OK', $responses[0]);
        $this->assertEquals('OK', $responses[1]);

        // Check that the keys were set correctly
        $this->assertEquals('Value 1', $this->redis->get('trans-key1'));
        $this->assertEquals('Value 2', $this->redis->get('trans-key2'));
    }
}

?>