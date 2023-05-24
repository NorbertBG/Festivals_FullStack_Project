// config/cloudinary.config.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require("dotenv");
const path = require("path");
 
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "dc0tzx7fa",
  api_key: process.env.CLOUDINARY_KEY || "821652497219421",
  api_secret: process.env.CLOUDINARY_SECRET || "c-GaeDtDZp2KgACO6HHt3JRVH0c",
  secure: true  // Add this line to enable the secure option
});

const storage = new CloudinaryStorage({
  // cloudinary: cloudinary,
  cloudinary,
  params: {
    allowed_formats: ['jpg', 'png', 'jpeg'],
    folder: 'movie-project' // The name of the folder in cloudinary
    // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
  }
});

//                     storage: storage
module.exports = multer({ storage });

