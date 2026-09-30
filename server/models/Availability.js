import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'unavailable'],
    default: 'available',
    required: true
  },
  guestCount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Availability = mongoose.models.Availability || mongoose.model('Availability', availabilitySchema);
export default Availability;
