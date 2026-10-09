import multer from 'multer';
import { HttpStatus } from '../config/constants.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP image files are allowed.'));
    }
  },
});

// Reads the optional "image" field and turns Multer errors into clear 400 responses
export function uploadImage(req, res, next) {
  upload.single('image')(req, res, (error) => {
    if (!error) return next();
    let message = error.message;
    if (error.code === 'LIMIT_FILE_SIZE') message = 'Image is too large. The maximum file size is 5 MB.';
    if (error.code === 'LIMIT_UNEXPECTED_FILE') message = 'Send the image in a form field named "image".';
    return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message });
  });
}

// The declared type can be faked by renaming a file, so check the file's first bytes
function detectImageType(buffer) {
  if (!buffer || buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

// Rejects files whose content is not really a JPEG, PNG, or WebP image
export function verifyImageContent(req, res, next) {
  if (!req.file) return next();
  const detectedType = detectImageType(req.file.buffer);
  if (!detectedType) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: 'The file is not a real JPEG, PNG, or WebP image.',
    });
  }
  req.file.mimetype = detectedType;
  next();
}

export default upload;
