/**
 * Production Server Configuration
 * Loads environment variables and provides sensible defaults.
 */
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // Database Configuration
  DB_FILE: process.env.DB_FILE || path.join(__dirname, "../data/production.db.json"),
  
  // Redis Cache Configuration
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || "300", 10),
  
  // Security & Salt
  MASTER_AUTH_SALT: process.env.MASTER_AUTH_SALT || "IT_ASSIGNMENT_SUPER_SECRET_SALT_2026_@#!$%",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  
  // Public directory for static frontend files
  STATIC_DIR: path.join(__dirname, "../../monitor_dashboard"),
};

