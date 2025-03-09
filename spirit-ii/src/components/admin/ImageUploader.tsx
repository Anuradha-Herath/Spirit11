"use client";

import { useState, useRef } from 'react';

interface ImageUploaderProps {
  initialImage?: string;
  onImageUpload: (imageUrl: string) => void;
  className?: string;
}

export default function ImageUploader({ initialImage, onImageUpload, className = '' }: ImageUploaderProps) {
  const [image, setImage] = useState(initialImage || '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError('');
    setUploadProgress(0);
    
    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
      setError('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image too large. Maximum size is 5MB.');
      return;
    }

    // Show preview immediately
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);

    // FOR DEBUGGING - If you want to skip actual uploads and just use local preview
    // This can be uncommented to test form functionality without Cloudinary
    // onImageUpload(imageUrl);  
    // return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      
      try {
        setIsUploading(true);
        
        // Get auth token (with fallback)
        let authHeader = 'Bearer development';
        try {
          const userData = localStorage.getItem("user");
          if (userData) {
            const user = JSON.parse(userData);
            authHeader = `Bearer ${user.username}`;
          }
        } catch (e) {
          console.warn('Auth error:', e);
        }
        
        console.log("Starting image upload...");
        
        // Upload to the API
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            image: base64String,
            folder: 'players'
          })
        });

        console.log("Upload response status:", response.status);
        const responseText = await response.text();
        console.log("Upload response text:", responseText);
        
        // Try to parse the response
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError);
          throw new Error('Invalid server response');
        }
        
        if (!data.url) {
          throw new Error('No URL returned from server');
        }
        
        console.log("Upload successful, URL:", data.url);
        
        // Clean up object URL and set the uploaded image URL
        URL.revokeObjectURL(imageUrl);
        setImage(data.url);
        onImageUpload(data.url);
        
      } catch (err) {
        console.error('Upload failed:', err);
        
        // Fall back to using the local preview in case of error
        setError('Upload failed. Using local preview instead.');
        onImageUpload(imageUrl);
      } finally {
        setIsUploading(false);
      }
    };
    
    // Add progress tracking
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 50);
        setUploadProgress(progress);
      }
    };
    
    reader.onerror = () => {
      console.error('FileReader error:', reader.error);
      setError('Error reading file: ' + (reader.error?.message || 'Unknown error'));
    };
    
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />
      
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors"
        onClick={triggerFileInput}
      >
        {isUploading ? (
          <div className="py-10 flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p className="text-sm text-gray-500">Uploading image...</p>
          </div>
        ) : image ? (
          <div className="relative">
            <img 
              src={image} 
              alt="Player" 
              className="mx-auto h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
              <p className="text-white text-sm">Click to change image</p>
            </div>
          </div>
        ) : (
          <div className="py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 font-medium text-gray-700">Click to upload local image</p>
            <p className="mt-1 text-xs text-gray-400">JPEG, PNG, WebP up to 5MB</p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
