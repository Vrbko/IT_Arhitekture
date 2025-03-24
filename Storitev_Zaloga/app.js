import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import carPartsRoutes from './routes/CarPartRoutes.js';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Now start the server once the database is connected
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// API Routes
app.use('/parts', carPartsRoutes);


const __dirname = path.resolve();

// Load swagger.yaml
const swaggerDocument = YAML.load(path.join(__dirname, 'public', 'swagger.yaml'));

// Serve Swagger UI at the /api-docs route
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


export default app;