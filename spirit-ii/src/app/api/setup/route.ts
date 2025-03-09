import { NextResponse } from 'next/server';
import { seedDatabase } from '@/utils/dbSeeder';

export async function GET(req: Request) {
  try {
    // Check if the setup secret is provided (for security)
    const url = new URL(req.url);
    const secret = url.searchParams.get('secret');
    
    if (secret !== process.env.SETUP_SECRET && secret !== 'spirit11-setup') {
      return NextResponse.json({ 
        message: 'Unauthorized setup attempt' 
      }, { status: 401 });
    }
    
    // Seed database
    const success = await seedDatabase();
    
    if (success) {
      return NextResponse.json({
        message: 'Database setup completed successfully',
      });
    } else {
      return NextResponse.json({
        message: 'Database setup failed. Check server logs for details.',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error during database setup:', error);
    return NextResponse.json({ 
      message: 'Internal Server Error' 
    }, { status: 500 });
  }
}
