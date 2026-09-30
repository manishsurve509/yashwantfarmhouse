import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  imageName: {
    type: String,
    required: true
  },
  altText: {
    type: String,
    default: 'Yashwant Farmhouse, Nandwal'
  },
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: 'Property'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
export default Gallery;
