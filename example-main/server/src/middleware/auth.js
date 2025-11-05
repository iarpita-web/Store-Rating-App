import jwt from 'jsonwebtoken';
import { HttpError } from './error.js';

export function authenticate(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new HttpError(401, 'Missing authorization token'));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role, email, name }
    return next();
  } catch (e) {
    return next(new HttpError(401, 'Invalid or expired token'));
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new HttpError(401, 'Unauthenticated'));
    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, 'Forbidden'));
    }
    return next();
  };
}
