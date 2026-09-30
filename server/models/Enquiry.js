import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    default: '',
    trim: true
  },
  preferredDate: {
    type: String,
    default: ''
  },
  guests: {
    type: String,
    default: '1-5'
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'confirmed', 'cancelled'],
    default: 'new'
  }
}, {
  timestamps: true
});

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
