import fs from 'fs';
import { connectDb } from '../services/fakeDb.js';
import { config } from '../config/env.js';
import AppError from '../utils/AppError.js';

export const getReferenceError = () => {
  console.log(user.name); // ReferenceError
};

export const getTypeError = () => {
  const obj = null;
  console.log(obj.name); // TypeError
};

export const getJsonError = () => {
  JSON.parse("{bad json}"); // SyntaxError
};

export const getAsyncError = async () => {
  await Promise.reject(new Error("Async operation failed"));
};

export const getDbError = async () => {
  await connectDb();
};

export const getFsError = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile("missing.txt", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

export const getEnvError = () => {
  if (!config.requiredKey) {
    throw new AppError("Missing environment variable: REQUIRED_KEY", 500);
  }
  return "All good";
};

export const getTimeoutError = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Operation timed out after 5 seconds");
    }, 5000);
  });
};

export const getMemoryError = () => {
  const arrays = [];
  try {
    for (let i = 0; i < 10000; i++) {
      arrays.push(new Array(1e6).fill('memory_leak'));
    }
  } catch (err) {
    throw err;
  }
  return "Memory pressure applied";
};

export const getCpuError = () => {
  const start = Date.now();
  // Block for 3 seconds to be safe for testing
  while (Date.now() - start < 3000) {
    // block event loop
  }
  throw new AppError("Event loop blocked for 3 seconds", 503);
};
