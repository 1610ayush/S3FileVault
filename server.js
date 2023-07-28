import dotenv from "dotenv";
dotenv.config()
import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import cors from 'cors';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
app.use(express.json());
app.use(cors());
const upload = multer({ dest: 'uploads/' });

// AWS configuration
AWS.config.update({
  accessKeyId: process.env.S3ACCESSKEYID,
  secretAccessKey: process.env.S3SECRETACCESSKEY,
  region: 'ap-south-1',
});

const s3 = new AWS.S3();

// JWT secret key 
const secretKey = process.env.JWTSECRETKEY;

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
app.use(express.static(`${currentDirPath}/public`));

const users = [];

// Middleware to verify user authentication using JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// User Registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Check if the user already exists
  if (users.some((user) => user.username === username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }

  // Save the new user
  const newUser = { username, password };
  users.push(newUser);

  res.sendStatus(200);
});

// User Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Find the user in the user array 
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  // Generate a JWT token with the user information and secret key
  const token = jwt.sign({ username: username }, secretKey);

  // Return the token in the response
  res.json({ token, username: username });
});

// Upload route (protected route)
app.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  fs.readFile(file.path, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read the uploaded file' });
    }

    const params = {
      Bucket: process.env.BUCKETNAME,
      Key: file.originalname,
      Body: data,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to upload file to S3' });
      }

      const fileUrl = data.Location;
      return res.status(200).json({ message: 'File uploaded successfully', fileUrl });
    });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});




































// import express from "express"
// import multer from "multer";
// import AWS from "aws-sdk";
// import cors from "cors";
// import fs from "fs";
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const app = express();
// app.use(cors());
// const upload = multer({ dest: 'uploads/' });

// // AWS configuration
// AWS.config.update({
//   accessKeyId: 'AKIA5RAODSFWF7VOQVHA',
//   secretAccessKey: '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',
//   region: 'ap-south-1',
// });

// const s3 = new AWS.S3();

// const currentFilePath = fileURLToPath(import.meta.url);
// const currentDirPath = dirname(currentFilePath);

// // Serve static files from the current module's directory (public folder)
// app.use(express.static(`${currentDirPath}/public`));

// // Upload route
// app.post('/upload', upload.single('file'), (req, res) => {
//   const file = req.file;

//   if (!file) {
//     return res.status(400).json({ error: 'No file provided' });
//   }

//   fs.readFile(file.path, (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Failed to read the uploaded file' });
//     }
//   const params = {
//     Bucket: 'mypersonals3bucket',
//     Key: file.originalname,
//     Body: data,
//   };

//   s3.upload(params, (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to upload file to S3' });
//     }

//     // Optionally, you can save the S3 URL in your database or use it for further processing.
//     const fileUrl = data.Location;
//     return res.status(200).json({ message: 'File uploaded successfully', fileUrl });
//   });
// });
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server running on port 3000');
// });
