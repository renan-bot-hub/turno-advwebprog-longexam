import mongoose from 'mongoose';
import Log from '../models/logModel.js';

// Saves each entry to the logs collection; falls back to the console if that fails
async function writeLog(level, message, metadata = {}) {
  const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
  consoleMethod(`[${level}] ${message}`);
  if (mongoose.connection.readyState !== 1) return;
  try {
    await Log.create({ level, message, ...metadata });
  } catch (error) {
    console.error(`Failed to write ${level} log:`, error.message);
  }
}

export const logger = {
  info: (message, metadata) => writeLog('info', message, metadata),
  warn: (message, metadata) => writeLog('warn', message, metadata),
  error: (message, metadata) => writeLog('error', message, metadata),
};

// Logs every request once its response has been sent (after authentication has set req.user)
export function auditLoggerMiddleware(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const logData = {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip || req.socket.remoteAddress,
      userId: req.user?.id || null,
      username: req.user?.email || null,
      statusCode: res.statusCode,
      metadata: {
        duration: `${Date.now() - startTime}ms`,
        userAgent: req.get('user-agent') || null,
      },
    };
    const message = `${logData.method} ${logData.path} - ${logData.statusCode}`;

    if (res.statusCode >= 500) logger.error(message, logData);
    else if (res.statusCode >= 400) logger.warn(message, logData);
    else logger.info(message, logData);
  });

  next();
}

export default auditLoggerMiddleware;
