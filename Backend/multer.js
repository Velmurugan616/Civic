import multer from 'multer';
import path from "path";
import fs from "fs";

// Multer storage configuration
const storageConfig = multer.diskStorage({

    destination: (req, file, cb) => {
        // console.log(req.body)
        const userId = req.body.userId;  // Extract userId from the request body
        // console.log("User ID:", userId); // Debugging log
        
        if (!userId) {
            return cb(new Error("User ID is required"), false);
        }

        const uploadPath = `proofs/${userId}/`; // Unique folder for each user

        // Check if folder exists, create it if not
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        const uniqueFilename = `${Date.now()}${path.extname(file.originalname)}`;

        cb(null, uniqueFilename);
    }
});

export const proofupload = multer({ storage: storageConfig }); // Multer middleware for file upload