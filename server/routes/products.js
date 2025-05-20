
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage });

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find().populate({
      path: 'creator',
      select: 'name email'
    });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: 'creator',
      select: 'name email bio storeName profileImage'
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// @desc    Get products by logged-in user
// @route   GET /api/products/user
// @access  Private
router.get('/user/me', protect, async (req, res, next) => {
  try {
    const products = await Product.find({ creator: req.user.id });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// @desc    Get products by specific user
// @route   GET /api/products/user/:userId
// @access  Public
router.get('/user/:userId', async (req, res, next) => {
  try {
    const products = await Product.find({ creator: req.params.userId });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private
router.post('/', protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), async (req, res, next) => {
  try {
    req.body.creator = req.user.id;

    // Get file paths
    let imageUrl = '';
    let fileUrl = '';

    if (req.files) {
      if (req.files.image) {
        imageUrl = `/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.file) {
        fileUrl = `/uploads/${req.files.file[0].filename}`;
      }
    }

    const product = await Product.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageUrl: imageUrl || '/placeholder.svg',
      fileUrl: fileUrl || '',
      creator: req.user.id
    });

    res.status(201).json(product);
  } catch (error) {
    // Clean up uploaded files if there was an error
    if (req.files) {
      if (req.files.image) {
        fs.unlinkSync(req.files.image[0].path);
      }
      if (req.files.file) {
        fs.unlinkSync(req.files.file[0].path);
      }
    }
    next(error);
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
router.put('/:id', protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check user is product owner
    if (product.creator.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    // Handle file uploads
    const updateData = { ...req.body };
    
    if (req.files) {
      // Update image if uploaded
      if (req.files.image) {
        // Delete old image if exists and isn't a default image
        if (product.imageUrl && !product.imageUrl.includes('placeholder') && fs.existsSync(path.join(__dirname, '..', product.imageUrl))) {
          fs.unlinkSync(path.join(__dirname, '..', product.imageUrl));
        }
        updateData.imageUrl = `/uploads/${req.files.image[0].filename}`;
      }
      
      // Update file if uploaded
      if (req.files.file) {
        // Delete old file if exists
        if (product.fileUrl && fs.existsSync(path.join(__dirname, '..', product.fileUrl))) {
          fs.unlinkSync(path.join(__dirname, '..', product.fileUrl));
        }
        updateData.fileUrl = `/uploads/${req.files.file[0].filename}`;
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json(product);
  } catch (error) {
    // Clean up uploaded files if there was an error
    if (req.files) {
      if (req.files.image) {
        fs.unlinkSync(req.files.image[0].path);
      }
      if (req.files.file) {
        fs.unlinkSync(req.files.file[0].path);
      }
    }
    next(error);
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check user is product owner
    if (product.creator.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    // Delete associated files
    if (product.imageUrl && !product.imageUrl.includes('placeholder') && fs.existsSync(path.join(__dirname, '..', product.imageUrl))) {
      fs.unlinkSync(path.join(__dirname, '..', product.imageUrl));
    }
    
    if (product.fileUrl && fs.existsSync(path.join(__dirname, '..', product.fileUrl))) {
      fs.unlinkSync(path.join(__dirname, '..', product.fileUrl));
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product removed'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
