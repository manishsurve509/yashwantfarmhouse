import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Farmhouse Manager'
  },
  role: {
    type: String,
    default: 'admin'
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export default Admin;
