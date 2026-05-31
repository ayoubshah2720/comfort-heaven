const { uploadBufferToCloudinary } = require('../utils/cloudinaryAssets');

async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'tools-uploads'
    });

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    err.status_code = err.status_code || 500;
    err.message = err.message || 'Image upload failed';
    return next(err);
  }
}

module.exports = { uploadImage };
