const router = require('express').Router();
const uploader = require('../middlewares/cloudinary.config');

// POST "/api/upload/media" => Upload an image to Cloudinary
router.post('/media', uploader.single('image'), (req, res, next) => {
  // console.log('Upload route HIT')
  if (!req.file) {
    return res.status(400).json({
      errorMessage: 'There was an issue uploading the image. Check image format and size.',
    });
  }
  res.json({ mediaUrl: req.file.path }); //send cloudinary route to the cliente, yay
});

module.exports = router;
