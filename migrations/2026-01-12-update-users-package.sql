-- Migration: Add package_level to users table
-- Date: 2026-01-12

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS package_level TEXT NOT NULL DEFAULT 'free' CHECK (package_level IN ('free', 'premium', 'admin'));

-- Update existing admins to have admin package level
UPDATE users SET package_level = 'admin' WHERE role = 'admin';
