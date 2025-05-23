<?php

if ($_SERVER['REQUEST_URI'] === '/documentation') {
    // Serve HTML with Swagger UI
    header('Content-Type: text/html');
    echo <<<HTML
<!DOCTYPE html>
<html>
<head>
  <title>API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      const ui = SwaggerUIBundle({
        url: '/swagger.yaml',
        dom_id: '#swagger-ui',
      });
    }
  </script>
</body>
</html>
HTML;
    exit;
}

if ($_SERVER['REQUEST_URI'] === '/swagger.yaml') {
    header('Content-Type: text/yaml');
    echo <<<YAML
openapi: 3.0.0
info:
  title: Order API
  version: 1.0.0
  description: API for placing orders and publishing to Redis.

paths:
  /API.php:
    post:
      summary: Create an order
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                part_name:
                  type: string
                  example: "brake pad"
                part_no:
                  type: string
                  example: "BP-12345"
                quantity:
                  type: integer
                  example: 2
              required:
                - part_name
                - part_no
                - quantity
      responses:
        '200':
          description: Order created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example:
                      message: "Narocilo oddano!"
                      order_id: 5
                      data:
                        part_name: "brake pad"
                        quantity: 2
                        part_no: "BP-12345"

YAML;
    exit;
}


if ($_SERVER['REQUEST_URI'] === '/documentation_grpc') {
    // Serve HTML with Swagger UI
    header('Content-Type: text/html');
    echo <<<HTML
<!DOCTYPE html>
<html>
<head>
  <title>API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      const ui = SwaggerUIBundle({
        url: '/swagger_grpc.yaml',
        dom_id: '#swagger-ui',
      });
    }
  </script>
</body>
</html>
HTML;
    exit;
}

if ($_SERVER['REQUEST_URI'] === '/swagger_grpc.yaml') {
    header('Content-Type: text/yaml');
    echo <<<YAML
openapi: 3.0.1
info:
  title: User Service API
  description: API for managing users, including creating users, retrieving user information, and login functionality.
  version: 1.0.0
servers:
  - url: 'http://localhost:50051'  # This would be the endpoint for gRPC-gateway if set up.
    description: gRPC server (RESTful proxy through gRPC-Gateway)
paths:
  /users:
    post:
      summary: Create a new user
      description: Create a new user with the provided username, email, age, and password.
      operationId: createUser
      requestBody:
        description: User data to create a new user
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                  example: "john_doe"
                email:
                  type: string
                  example: "john.doe@example.com"
                age:
                  type: integer
                  example: 30
                password:
                  type: string
                  example: "securePassword123"
      responses:
        '200':
          description: User created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  user_id:
                    type: integer
                    example: 1
                  username:
                    type: string
                    example: "john_doe"
                  email:
                    type: string
                    example: "john.doe@example.com"
                  age:
                    type: integer
                    example: 30
                  message:
                    type: string
                    example: "User created successfully"
        '400':
          description: Bad request, invalid data provided
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Invalid data"
  /users/{user_id}:
    get:
      summary: Retrieve user information by user ID
      description: Fetch user details by providing their user ID.
      operationId: getUser
      parameters:
        - name: user_id
          in: path
          required: true
          description: The unique ID of the user to retrieve
          schema:
            type: integer
      responses:
        '200':
          description: User information retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  user_id:
                    type: integer
                    example: 1
                  username:
                    type: string
                    example: "john_doe"
                  email:
                    type: string
                    example: "john.doe@example.com"
                  age:
                    type: integer
                    example: 30
                  message:
                    type: string
                    example: "User fetched successfully"
        '404':
          description: User not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "User not found"
  /users/login:
    post:
      summary: User login
      description: Log in with a username and password to authenticate the user.
      operationId: loginUser
      requestBody:
        description: User credentials to log in
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                  example: "john_doe"
                password:
                  type: string
                  example: "securePassword123"
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "Login successful"
        '400':
          description: Invalid login credentials
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: false
                  message:
                    type: string
                    example: "Incorrect password"
        '404':
          description: User not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: false
                  message:
                    type: string
                    example: "User not found"
components:
  schemas:
    User:
      type: object
      properties:
        user_id:
          type: integer
        username:
          type: string
        email:
          type: string
        age:
          type: integer
        password:
          type: string
    LoginRequest:
      type: object
      properties:
        username:
          type: string
        password:
          type: string
    UserResponse:
      type: object
      properties:
        user_id:
          type: integer
        username:
          type: string
        email:
          type: string
        age:
          type: integer
        message:
          type: string
    LoginResponse:
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string

YAML;
    exit;
}

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