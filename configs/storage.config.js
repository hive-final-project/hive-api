const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary')

cloudinary.config({
 cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
 cloudinary: cloudinary,
 folder: 'lab-profile',
 allowedFormats: ['jpg', 'png'],
 filename: function (req, file, cb) {
   // podemos hacer una carpeta para cada usuario metiendo el ${req.user.id}/ antes de lo de abajo
   cb(null, `${new Date().getTime()}-${file.originalname}`);
 }
});

module.exports = multer({ storage })