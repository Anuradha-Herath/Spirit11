/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  images: {
    domains: ['res.cloudinary.com', 'via.placeholder.com'],
  },
  // Set this to false to prevent strict mode double-mounting in development
  // which can cause issues with some APIs like Cloudinary
  // Uncomment if you encounter issues with double uploads
  // reactStrictMode: false,
};

module.exports = nextConfig;