import AppError from '../utils/AppError.js';

export const connectDb = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate connection refused
      reject(new AppError('Database connection refused', 503, true));
    }, 100);
  });
};
