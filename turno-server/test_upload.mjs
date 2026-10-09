import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fsmod from 'fs';
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
const buf = fsmod.readFileSync('C:/Users/Lenovo/Downloads/leovik.jpg');
const r = await new Promise((resolve, reject) => { const s = cloudinary.uploader.upload_stream({folder:'test-debug'},(e,res)=>e?reject(e):resolve(res)); s.end(buf); });
console.log('Upload OK:', r.secure_url);
