import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import Product from './src/models/Product.js';
import { authenticate } from './src/middleware/authentication.js';
import { requireRole } from './src/middleware/requireRole.js';
import fs from 'fs';
import http from 'http';

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5*1024*1024 }, fileFilter: (_req, file, cb) => { const ok = ['image/jpeg','image/png','image/webp'].includes(file.mimetype); cb(ok ? null : new Error('Bad type'), ok); } });

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'bulldogs-exchange/products' }, (error, result) => { if (error) reject(error); else resolve(result); });
    stream.end(buffer);
  });
}

function handleImageUpload(req, res, next) {
  upload.single('image')(req, res, (error) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    next();
  });
}

const app = express();
await mongoose.connect(process.env.MONGODB_URI);
console.log('DB connected');

app.post('/:id/upload-image', authenticate, requireRole('Admin'), handleImageUpload, async (req, res) => {
  try {
    console.log('req.file:', req.file ? JSON.stringify({fieldname: req.file.fieldname, mimetype: req.file.mimetype, size: req.file.size, hasBuffer: !!req.file.buffer}) : 'undefined');
    const product = await Product.findById(req.params.id);
    console.log('product:', product ? product.name : 'NOT FOUND');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Image file is required.' });
    const result = await uploadBufferToCloudinary(req.file.buffer);
    console.log('Cloudinary result:', result.secure_url);
    product.imageUrl = result.secure_url;
    await product.save();
    console.log('Product saved');
    res.status(200).json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    console.error('ROUTE ERROR:', error.message);
    console.error('STACK:', error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.use((error, _req, res, _next) => {
  console.error('EXPRESS ERROR HANDLER:', error.message);
  console.error('STACK:', error.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const server = app.listen(5005, async () => {
  console.log('Test route server on 5005');
  // Build multipart body manually
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const fileData = fs.readFileSync('C:/Users/Lenovo/Downloads/leovik.jpg');
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjQ0ZDEyZjY4MjI4ZGI0MjZjOGQyNCIsIm5hbWUiOiJCdWxsZG9nRXggQWRtaW4iLCJlbWFpbCI6ImFkbWluQGJ1bGxkb2dleC5jb20iLCJyb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJCdWxsZG9nRXgiLCJsYXN0TmFtZSI6IkFkbWluIiwiaWF0IjoxNzkwMjMxNDQ5LCJleHAiOjE3OTA4MzYyNDl9.Wk6kdx5FS7YRDVbxJhNl1fBbRZEvAVifcqHqWZDxpsM';
  const body = Buffer.concat([
    Buffer.from('--' + boundary + '\r\nContent-Disposition: form-data; name="image"; filename="leovik.jpg"\r\nContent-Type: image/jpeg\r\n\r\n'),
    fileData,
    Buffer.from('\r\n--' + boundary + '--\r\n')
  ]);
  const options = { hostname: 'localhost', port: 5005, path: '/6ab4276a848c86f7d8dd2a45/upload-image', method: 'POST', headers: { 'Content-Type': 'multipart/form-data; boundary=' + boundary, 'Content-Length': body.length, 'Authorization': 'Bearer ' + token } };
  const req2 = http.request(options, (resp) => {
    let data = '';
    resp.on('data', (chunk) => data += chunk);
    resp.on('end', () => { console.log('Auto-test response:', resp.statusCode, data); server.close(); process.exit(0); });
  });
  req2.on('error', (e) => { console.error('Request error:', e.message); process.exit(1); });
  req2.write(body);
  req2.end();
});
