import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'per night'
  },
  description: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  badge: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Price = mongoose.models.Price || mongoose.model('Price', priceSchema);
export default Price;
