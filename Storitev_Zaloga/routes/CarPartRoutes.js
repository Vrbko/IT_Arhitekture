import express from 'express';
import CarPart from '../models/CarPart.js'; // Use .js extension for ES modules
const router = express.Router();

// Create a new car part
router.post('/', async (req, res) => {
  const { name, partNumber, category, manufacturer, price, stock, description } = req.body;

  try {
    const newCarPart = new CarPart({ name, partNumber, category, manufacturer, price, stock, description });
    await newCarPart.save();
    res.status(201).json(newCarPart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all car parts
router.get('/', async (req, res) => {
  try {
    const carParts = await CarPart.find();
    res.json(carParts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a car part by part number
router.get('/:partNumber', async (req, res) => {
  try {
    const carPart = await CarPart.findOne({ partNumber: req.params.partNumber });
    if (!carPart) return res.status(404).json({ error: 'Car part not found' });
    res.json(carPart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a car part by part number
router.put('/:partNumber', async (req, res) => {
  try {
    const carPart = await CarPart.findOneAndUpdate(
      { partNumber: req.params.partNumber },
      req.body,
      { new: true }
    );
    if (!carPart) return res.status(404).json({ error: 'Car part not found' });
    res.json(carPart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a car part by part number
router.delete('/:partNumber', async (req, res) => {
  try {
    const carPart = await CarPart.findOneAndDelete({ partNumber: req.params.partNumber });
    if (!carPart) return res.status(404).json({ error: 'Car part not found' });
    res.json({ message: 'Car part deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export the router as a default export
export default router;