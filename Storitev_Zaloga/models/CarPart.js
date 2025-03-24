import mongoose from 'mongoose';

const carPartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  partNumber: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  manufacturer: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  description: { type: String },
  dateAdded: { type: Date, default: Date.now }
});

const CarPart = mongoose.model('CarPart', carPartSchema);

export default CarPart;  // Export the CarPart model using ES module syntax