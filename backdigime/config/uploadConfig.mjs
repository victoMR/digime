import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp'; // Image optimization library

// Improved file storage and upload configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/';
    
    // Ensure upload directory exists
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Error creating upload directory:', err);
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename
    const sanitizedOriginalName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '_');
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(sanitizedOriginalName);
    
    cb(null, `${uniqueSuffix}-${sanitizedOriginalName.replace(extension, '')}${extension}`);
  }
});

// File filter for additional security
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Check file type
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only images are allowed.'), false);
  }

  // Check file size
  if (file.size > maxFileSize) {
    return cb(new Error('File size exceeds the limit of 10MB'), false);
  }

  cb(null, true);
};

// Image optimization middleware
const optimizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const tempOptimizedPath = path.join(req.file.destination, `optimized-${req.file.filename}`);

    // Optimiza la imagen
    await sharp(req.file.path)
      .resize({ width: 800, height: 800, fit: sharp.fit.inside, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(tempOptimizedPath);

    // Elimina el archivo original
    await fs.unlink(req.file.path);

    // Almacena la ruta temporal
    req.file.path = tempOptimizedPath;
    req.file.filename = `optimized-${req.file.filename}`;
    req.file.mimetype = "image/webp";

    next();
  } catch (error) {
    console.error("Image optimization error:", error);
    next(error);
  }
};


// Configure multer with enhanced options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1, // Limit to single file upload
    fieldSize: 10 * 1024 * 1024 // 10MB field size
  }
});

// Error handling middleware for file upload
const handleFileUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  } else if (err) {
    // An unknown error occurred
    return res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
  next();
};

export { 
  upload, 
  optimizeImage, 
  handleFileUploadError 
};