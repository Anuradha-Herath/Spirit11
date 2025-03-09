import { v2 as cloudinary } from 'cloudinary';

// Debug the environment variables
console.log('Cloudinary configuration check:', {
  cloud_name_exists: typeof process.env.CLOUDINARY_CLOUD_NAME === 'string',
  api_key_exists: typeof process.env.CLOUDINARY_API_KEY === 'string', 
  api_secret_exists: typeof process.env.CLOUDINARY_API_SECRET === 'string',
  // Show partial values for debugging (never log full secrets)
  cloud_name_preview: process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.substring(0, 4) + '...' : 'undefined',
});

// Initialize Cloudinary - handle development mode separately
let cloudinaryConfigured = false;
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  cloudinaryConfigured = true;
  console.log('Cloudinary initialized successfully');
} catch (error) {
  console.error('Failed to initialize Cloudinary:', error);
}

/**
 * Upload an image to Cloudinary
 * @param imageFile - Base64 encoded image or URL
 * @param folder - Cloudinary folder to store image in
 * @returns Object with secure URL and public ID
 */
export async function uploadImage(imageFile: string, folder = 'players') {
  // Always return a placeholder for local development to make testing easier
  if (process.env.NODE_ENV === 'development' && !cloudinaryConfigured) {
    console.log('Development mode: Returning placeholder without trying Cloudinary');
    return {
      url: 'https://via.placeholder.com/300?text=Local+Dev+Image',
      public_id: 'dev-placeholder'
    };
  }

  // First, check if we have valid credentials
  if (!cloudinaryConfigured || !process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('Cloudinary not properly configured');
    return {
      url: 'https://via.placeholder.com/300?text=Config+Error',
      public_id: 'error-placeholder'
    };
  }

  // Now attempt the actual upload
  try {
    console.log('Attempting to upload to Cloudinary...');
    
    // Validate the image data
    if (!imageFile || typeof imageFile !== 'string') {
      throw new Error('Invalid image data provided');
    }
    
    // Process the upload
    const uploadResult = await cloudinary.uploader.upload(imageFile, {
      folder: `spirit11/${folder}`,
      resource_type: 'image'
    });
    
    console.log('Upload successful!');
    
    return {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    // Even if upload fails, return something usable
    return {
      url: 'https://via.placeholder.com/300?text=Upload+Failed',
      public_id: 'error-fallback'
    };
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - Cloudinary public ID of the image
 */
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}

export default cloudinary;
