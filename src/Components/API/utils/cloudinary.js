require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

// Multer middleware cho upload file
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Upload buffer lên Cloudinary
const uploadToCloudinary = (buffer, folder = "movie_app", options = {}) => {
  return new Promise((resolve, reject) => {
    const { mimetype = "image/jpeg", resource_type = "image" } = options;

    const base64 = buffer.toString("base64");
    const dataUri = `data:${mimetype};base64,${base64}`;

    cloudinary.uploader.upload(
      dataUri,
      {
        folder,
        resource_type,
        transformation:
          resource_type === "image"
            ? [
                { width: 1600, height: 1600, crop: "limit" },
                { quality: "auto" },
              ]
            : undefined,
      },
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
  });
};

module.exports = {
  upload,
  uploadToCloudinary,
};
