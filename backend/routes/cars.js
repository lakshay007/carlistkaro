const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { auth } = require('../middleware/auth.js');
const Car = require('../models/Car.js');
const streamifier = require('streamifier');

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - images
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         title:
 *           type: string
 *           description: Car title
 *         description:
 *           type: string
 *           description: Car description
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         tags:
 *           type: object
 *           properties:
 *             car_type:
 *               type: string
 *             company:
 *               type: string
 *             dealer:
 *               type: string
 *         user:
 *           type: string
 *           description: User ID who created the car listing
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars for authenticated user
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering cars
 *     responses:
 *       200:
 *         description: List of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 * 
 *   post:
 *     summary: Create a new car listing
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: string
 *                 description: JSON string of tags object
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get a specific car by ID
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car details
 *       404:
 *         description: Car not found
 * 
 *   put:
 *     summary: Update a car listing
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: string
 *               keepImages:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       404:
 *         description: Car not found
 * 
 *   delete:
 *     summary: Delete a car listing
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 */

// Debug logging for environment variables
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET?.slice(0, 5) + '...' // Only log part of the secret
});

// Configure Cloudinary - Move this before creating the router
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const router = express.Router();

// Test Cloudinary configuration
cloudinary.api.ping()
  .then(result => console.log('Cloudinary connection successful:', result))
  .catch(error => console.error('Cloudinary connection failed:', error));

// Configure Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Create car
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    const { title, description, tags } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Upload images to Cloudinary
    const imagePromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: 'cars',
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    const imageUrls = await Promise.all(imagePromises);
    console.log('Uploaded image URLs:', imageUrls);

    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

    const car = new Car({
      title,
      description,
      images: imageUrls,
      tags: parsedTags, 
      user: req.userId
    });

    const savedCar = await car.save();
    console.log('Saved car:', savedCar);
    
    res.status(201).json(savedCar);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ 
      message: 'Error creating car listing',
      error: error.message 
    });
  }
});

// Get all cars for user
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { user: req.userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'tags.car_type': { $regex: search, $options: 'i' } },
        { 'tags.company': { $regex: search, $options: 'i' } },
        { 'tags.dealer': { $regex: search, $options: 'i' } }
      ];
    }

    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars' });
  }
});

// Get single car
router.get('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, user: req.userId });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching car' });
  }
});

// Update car
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    console.log('Update request body:', req.body);
    console.log('Update files:', req.files);

    const car = await Car.findOne({ _id: req.params.id, user: req.userId });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const { title, description, tags, keepImages } = req.body;
    console.log('Received keepImages:', keepImages);
    
    let keepImageUrls = [];
    try {
      keepImageUrls = keepImages ? JSON.parse(keepImages) : [];
    } catch (error) {
      console.error('Error parsing keepImages:', error);
      return res.status(400).json({ message: 'Invalid keepImages format' });
    }

    // Upload new images if any
    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: 'cars',
              resource_type: 'auto'
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );

          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      });

      try {
        newImageUrls = await Promise.all(imagePromises);
        console.log('New image URLs:', newImageUrls);
      } catch (error) {
        console.error('Error uploading new images:', error);
        return res.status(500).json({ message: 'Error uploading new images' });
      }
    }

    // Delete removed images from Cloudinary
    const removedImages = car.images.filter(img => !keepImageUrls.includes(img));
    if (removedImages.length > 0) {
      try {
        const deletePromises = removedImages.map(imageUrl => {
          const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
          return cloudinary.uploader.destroy(`cars/${publicId}`);
        });
        await Promise.all(deletePromises);
      } catch (error) {
        console.error('Error deleting old images:', error);
        // Continue with the update even if image deletion fails
      }
    }

    // Update car
    car.title = title || car.title;
    car.description = description || car.description;
    if (tags) {
      try {
        car.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (error) {
        console.error('Error parsing tags:', error);
        return res.status(400).json({ message: 'Invalid tags format' });
      }
    }
    car.images = [...keepImageUrls, ...newImageUrls];

    const updatedCar = await car.save();
    console.log('Updated car:', updatedCar);
    res.json(updatedCar);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ 
      message: 'Error updating car',
      error: error.message 
    });
  }
});

// Delete car
router.delete('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, user: req.userId });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Delete images from Cloudinary
    const deletePromises = car.images.map(imageUrl => {
      const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
      return cloudinary.uploader.destroy(`cars/${publicId}`);
    });

    await Promise.all(deletePromises);
    await car.deleteOne();
    
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting car' });
  }
});

module.exports = router; 