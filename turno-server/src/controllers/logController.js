import Log from '../models/logModel.js';
import { HttpStatus } from '../config/constants.js';

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

// GET / — Admin. Audit log entries, newest first.
// Filters: ?level=warn&method=POST&statusCode=401&userId=...&page=1&limit=20
export async function getLogs(req, res, next) {
  try {
    const page = parsePositiveInteger(req.query.page, 1);
    const limit = Math.min(parsePositiveInteger(req.query.limit, 20), 100);
    const filter = {};
    if (['info', 'warn', 'error'].includes(req.query.level)) filter.level = req.query.level;
    if (req.query.method) filter.method = String(req.query.method).toUpperCase();
    if (req.query.statusCode) filter.statusCode = Number(req.query.statusCode);
    if (/^[a-f\d]{24}$/i.test(req.query.userId || '')) filter.userId = req.query.userId;

    const [logs, total] = await Promise.all([
      Log.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Log.countDocuments(filter),
    ]);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Audit logs retrieved successfully.',
      count: total,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      data: logs,
    });
  } catch (error) {
    next(error);
  }
}
