import mongoose from 'mongoose';

// One document per API request, written by the audit logger middleware
const logSchema = new mongoose.Schema(
  {
    level: { type: String, enum: ['info', 'warn', 'error'], required: true },
    message: { type: String, required: true },
    method: { type: String },
    path: { type: String },
    statusCode: { type: Number },
    ip: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    username: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

logSchema.index({ level: 1, createdAt: -1 });
// Logs older than 30 days are removed automatically
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model('Log', logSchema);
