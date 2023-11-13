const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.PHOTO_NAME,
    api_key: process.env.PHOTO_KEY,
    api_secret: process.env.PHOTO_SECRET,
});

module.exports = cloudinary;
