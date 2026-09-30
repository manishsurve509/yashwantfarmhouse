import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Gallery from '../models/Gallery.js';
import { authMiddleware } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Upload directory setup in public/uploads
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E6)}`;
    cb(null, `farm-${cleanBase}-${uniqueSuffix}${ext}`);
  }
});

// File filter: JPEG, PNG, WEBP, AVIF
const fileFilter = (req, file, cb) => {
  const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
  const allowedExt = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMime.includes(file.mimetype) || allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and AVIF images are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter
});

// GET /api/gallery - All photos
router.get('/', async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ featured: -1, order: 1, createdAt: -1 });
    res.json({
      success: true,
      photos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/gallery/upload - Upload single or multiple images
router.post('/upload', authMiddleware, (req, res) => {
  upload.array('images', 12)(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum allowed size is 10MB per image.'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error.'
      });
    }

    try {
      const files = req.files || [];
      const { category, altText } = req.body;

      if (files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please choose at least one image to upload.'
        });
      }

      const createdPhotos = [];

      for (const file of files) {
        const photo = await Gallery.create({
          imageUrl: `/uploads/${file.filename}`,
          imageName: file.originalname,
          altText: altText || file.originalname.replace(/[-_.]+/g, ' '),
          category: category || 'Property',
          featured: false
        });
        createdPhotos.push(photo);
      }

      res.status(201).json({
        success: true,
        message: `Successfully uploaded ${createdPhotos.length} photo(s).`,
        photos: createdPhotos
      });
    } catch (error) {
      console.error('Gallery upload error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// POST /api/gallery/add-url - Add photo by URL
router.post('/add-url', authMiddleware, async (req, res) => {
  try {
    const { imageUrl, imageName, altText, category, featured } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image URL is required.' });
    }

    const photo = await Gallery.create({
      imageUrl: imageUrl.trim(),
      imageName: imageName || 'Farmhouse Photo',
      altText: altText || 'Yashwant Farmhouse, Nandwal',
      category: category || 'Property',
      featured: Boolean(featured)
    });

    res.status(201).json({
      success: true,
      message: 'Photo added successfully.',
      photo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/gallery/:id/feature - Toggle featured status
router.put('/:id/feature', authMiddleware, async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found.' });
    }

    photo.featured = !photo.featured;
    await photo.save();

    res.json({
      success: true,
      message: photo.featured ? 'Photo marked as featured.' : 'Photo unfeatured.',
      photo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/gallery/:id - Delete photo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found.' });
    }

    // If it's a local upload, clean up the disk file safely
    if (photo.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(uploadDir, path.basename(photo.imageUrl));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Could not remove file on disk:', e.message);
        }
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Photo deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
