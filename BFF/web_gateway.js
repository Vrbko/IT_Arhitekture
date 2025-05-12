// web-gateway.js
const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const axios = require('axios');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

// gRPC client setup
const proto = protoLoader.loadSync('./user.proto');
const userProto = grpc.loadPackageDefinition(proto).user;
const grpcClient = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());

// REST to gRPC -get user
app.get('/web/users/:id', (req, res) => {
  grpcClient.GetUser({ id: req.params.id }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response);
  });
});

// REST to gRPC -login user
app.post('/web/auth/login', async (req, res) => {
    grpcClient.Login({ username: req.body.username, password:req.body.password }, (err, response) => {
        if (err) return res.status(500).send(err);
        res.json(response);
      });
});

app.post('/web/auth/loginGetData', async (req, res) => {
    const { username, password } = req.body;
  
    grpcClient.Login({ username, password }, async (err, loginResponse) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed', details: err });
      }
  
      if (!loginResponse.success) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      try {
        const { data } = await axios.get('http://localhost:3000/parts', { params: req.body });
  
        res.json({
          login: loginResponse,
          parts: data
        });
      } catch (apiErr) {
        res.status(500).json({ error: 'Failed to fetch parts', details: apiErr.message });
      }
    });
  });

// REST to gRPC -register user
app.post('/web/auth/register', async (req, res) => {
    grpcClient.CreateUser({email:req.body.email, username: req.body.username, password:req.body.password }, (err, response) => {
        if (err) return res.status(500).send(err);
        res.json(response);
      });
});
// REST to REST-redis - new order
app.post('/web/order', async (req, res) => {
    const { data } = await axios.post('http://localhost:8000/API.php', req.body);
    res.json(data);
  });

  // REST to REST - get parts
app.post('/web/catalog', async (req, res) => {
    const { data } = await axios.get('http://localhost:3000/parts', req.body);
    res.json(data);
  });



app.listen(3010, () => console.log('Web Gateway on :3010'));