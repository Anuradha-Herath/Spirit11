import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    // Relax authentication for development
    const authHeader = req.headers.get('authorization');
    
    // Get the image data from the request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json({ 
        message: 'Invalid request body',
        url: 'https://via.placeholder.com/300?text=Error'
      }, { status: 400 });
    }
    
    const { image, folder = 'players' } = body;
    
    if (!image) {
      console.error('No image provided in request');
      return NextResponse.json({ 
        message: 'No image provided',
        url: 'https://via.placeholder.com/300?text=No+Image' 
      }, { status: 400 });
    }
    
    console.log('Image upload request received, processing...');
    
    // Upload to Cloudinary (with fallback handling built in)
    const result = await uploadImage(image, folder);
    
    // Always return something usable
    return NextResponse.json({
      url: result.url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Error in upload API route:', error);
    return NextResponse.json({ 
      message: 'Error uploading image',
      url: 'https://via.placeholder.com/300?text=API+Error'
    }, { status: 500 });
  }
}
