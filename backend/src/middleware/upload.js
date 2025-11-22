const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads/';
        if (file.fieldname === 'profilePicture') {
            folder += 'profiles/';
        } else if (file.fieldname === 'images') {
            folder += 'products/';
        } else if (file.fieldname === 'documents') {
            folder += 'verification/';
        }
        
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Multiple upload configurations
const uploadSingle = upload.single('profilePicture');
const uploadMultiple = upload.array('images', 5); // Max 5 product images
const uploadDocuments = upload.array('documents', 3); // Max 3 verification documents

module.exports = {
    uploadSingle,
    uploadMultiple,
    uploadDocuments
};