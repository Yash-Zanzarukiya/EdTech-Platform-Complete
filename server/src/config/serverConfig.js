import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URL = process.env.MONGO_URL;
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;
export const BASE_URL = process.env.BASE_URL;
export const DB_NAME = process.env.DB_NAME;
export const CLIENT_URL = process.env.CLIENT_URL;
export const EMAIL_ID = process.env.EMAIL_ID;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
export const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
