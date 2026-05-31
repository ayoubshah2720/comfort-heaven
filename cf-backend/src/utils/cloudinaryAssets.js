const cloudinary = require('../config/cloudinary');

function uploadBufferToCloudinary(buffer, options = {}) {
  const { folder } = options;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          const err = new Error(error.message || 'Cloudinary upload failed');
          err.status_code = 502;
          err.cause = error;
          reject(err);
          return;
        }

        if (!result || !result.secure_url || !result.public_id) {
          const err = new Error('Cloudinary upload failed');
          err.status_code = 502;
          reject(err);
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

async function destroyCloudinaryImage(publicId) {
  if (!publicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image'
    });

    if (result.result === 'ok' || result.result === 'not found') {
      return result;
    }

    const err = new Error(`Cloudinary delete failed: ${result.result}`);
    err.status_code = 502;
    throw err;
  } catch (error) {
    if (error.status_code) {
      throw error;
    }

    const err = new Error(error.message || 'Cloudinary delete failed');
    err.status_code = 502;
    err.cause = error;
    throw err;
  }
}

module.exports = {
  uploadBufferToCloudinary,
  destroyCloudinaryImage
};
