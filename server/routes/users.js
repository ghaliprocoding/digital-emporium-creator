
const express = require('express');
const router = express.Router();
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

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, upload.single('profileImage'), async (req, res, next) => {
  try {
    const { name, email, bio, storeName } = req.body;
    
    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (bio) updateFields.bio = bio;
    if (storeName) updateFields.storeName = storeName;
    
    // Handle profile image upload
    if (req.file) {
      // Get the current user to check if they have a profile image to delete
      const currentUser = await User.findById(req.user.id);
      
      // Delete the old profile image if it exists
      if (currentUser.profileImage && !currentUser.profileImage.includes('placeholder') && fs.existsSync(path.join(__dirname, '..', currentUser.profileImage))) {
        fs.unlinkSync(path.join(__dirname, '..', currentUser.profileImage));
      }
      
      // Set the new profile image path
      updateFields.profileImage = `/uploads/${req.file.filename}`;
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json(user);
  } catch (error) {
    // Delete uploaded file if there was an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
});

module.exports = router;
