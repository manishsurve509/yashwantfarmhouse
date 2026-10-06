import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import Gallery from '../models/Gallery.js';
import { authMiddleware } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';
import { persistentStore } from '../store/memoryStore.js';

const router = express.Router();

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Upload directory setup
const uploadDir = (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME)
  ? path.join('/tmp', 'uploads')
  : path.resolve(process.cwd(), 'public', 'uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('[Gallery] Could not initialize uploadDir:', e.message);
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
    fileSize: 15 * 1024 * 1024 // 15MB limit
  },
  fileFilter
});

// GET /api/gallery - All photos
router.get('/', async (req, res) => {
  try {
    if (isDBConnected()) {
      try {
        const photos = await Gallery.find().sort({ featured: -1, order: 1, createdAt: -1 });
        // Sync to persistent store
        persistentStore.data.gallery = photos.map(p => ({
          ...p.toObject(),
          _id: p._id.toString()
        }));
        persistentStore.save();

        return res.json({ success: true, photos });
      } catch (e) {
        console.warn('[Gallery API] DB find failed, using persistent store:', e.message);
      }
    }

    res.json({
      success: true,
      photos: persistentStore.getGallery()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload handler shared by /upload and / (POST)
const handleUpload = (req, res) => {
  upload.array('images', 12)(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum allowed size is 15MB per image.'
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

      // Check if it's a URL-based submission instead of file upload
      if (files.length === 0 && req.body.imageUrl) {
        const photoData = {
          imageUrl: req.body.imageUrl.trim(),
          imageName: req.body.imageName || 'Farmhouse Photo',
          altText: altText || 'Yashwant Farmhouse, Nandwal',
          category: category || 'Property',
          featured: Boolean(req.body.featured)
        };

        let photo = null;
        if (isDBConnected()) {
          try {
            photo = await Gallery.create(photoData);
          } catch (e) {
            console.warn('[Gallery API] DB photo create failed:', e.message);
          }
        }
        const diskPhoto = persistentStore.addGalleryPhoto({
          ...(photo ? { _id: photo._id.toString() } : {}),
          ...photoData
        });

        return res.status(201).json({
          success: true,
          message: 'Photo saved successfully to database.',
          photos: [photo || diskPhoto],
          photo: photo || diskPhoto
        });
      }

      if (files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please choose at least one image to upload or specify an imageUrl.'
        });
      }

      const createdPhotos = [];

      for (const file of files) {
        const photoData = {
          imageUrl: `/uploads/${file.filename}`,
          imageName: file.originalname,
          altText: altText || file.originalname.replace(/[-_.]+/g, ' '),
          category: category || 'Property',
          featured: false
        };

        let photo = null;

        if (isDBConnected()) {
          try {
            photo = await Gallery.create(photoData);
          } catch (e) {
            console.warn('[Gallery API] DB photo create failed:', e.message);
          }
        }

        const diskPhoto = persistentStore.addGalleryPhoto({
          ...(photo ? { _id: photo._id.toString() } : {}),
          ...photoData
        });

        createdPhotos.push(photo || diskPhoto);
      }

      res.status(201).json({
        success: true,
        message: `Successfully uploaded and saved ${createdPhotos.length} photo(s) to database.`,
        photos: createdPhotos
      });
    } catch (error) {
      console.error('[Gallery API] Upload error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
};

// POST /api/gallery/upload
router.post('/upload', authMiddleware, handleUpload);

// POST /api/gallery (Standard REST endpoint for image upload/add)
router.post('/', authMiddleware, handleUpload);

// POST /api/gallery/add-url - Add photo by URL
router.post('/add-url', authMiddleware, async (req, res) => {
  try {
    const { imageUrl, imageName, altText, category, featured } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image URL is required.' });
    }

    const photoData = {
      imageUrl: imageUrl.trim(),
      imageName: imageName || 'Farmhouse Photo',
      altText: altText || 'Yashwant Farmhouse, Nandwal',
      category: category || 'Property',
      featured: Boolean(featured)
    };

    let photo = null;

    if (isDBConnected()) {
      try {
        photo = await Gallery.create(photoData);
      } catch (e) {
        console.warn('[Gallery API] DB photo create failed:', e.message);
      }
    }

    const diskPhoto = persistentStore.addGalleryPhoto({
      ...(photo ? { _id: photo._id.toString() } : {}),
      ...photoData
    });

    res.status(201).json({
      success: true,
      message: 'Photo saved permanently to database.',
      photo: photo || diskPhoto
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/gallery/:id/feature - Toggle featured status
router.put('/:id/feature', authMiddleware, async (req, res) => {
  try {
    let photo = null;
    const photoId = req.params.id;

    if (isDBConnected()) {
      try {
        if (isValidId(photoId)) {
          photo = await Gallery.findById(photoId);
        }
        if (photo) {
          photo.featured = !photo.featured;
          await photo.save();
        }
      } catch (e) {
        console.warn('[Gallery API] DB feature toggle failed:', e.message);
      }
    }

    const diskPhoto = persistentStore.toggleFeatured(photoId);
    const result = photo || diskPhoto;

    if (!result) {
      return res.status(404).json({ success: false, message: 'Photo not found in database.' });
    }

    res.json({
      success: true,
      message: result.featured ? 'Photo marked as featured.' : 'Photo unfeatured.',
      photo: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/gallery/:id - Delete photo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    let deleted = null;
    const photoId = req.params.id;

    if (isDBConnected()) {
      try {
        if (isValidId(photoId)) {
          const photo = await Gallery.findById(photoId);
          if (photo) {
            if (photo.imageUrl.startsWith('/uploads/')) {
              const filePath = path.join(uploadDir, path.basename(photo.imageUrl));
              if (fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (_) {}
              }
            }
            deleted = await Gallery.findByIdAndDelete(photoId);
          }
        }
      } catch (e) {
        console.warn('[Gallery API] DB delete failed:', e.message);
      }
    }

    const diskDeleted = persistentStore.deleteGalleryPhoto(photoId);

    if (!deleted && !diskDeleted) {
      return res.status(404).json({ success: false, message: 'Photo not found.' });
    }

    res.json({
      success: true,
      message: 'Photo deleted permanently from database.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
