import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import * as crypto from 'crypto';

// Function to verify password
function verifyPassword(storedPassword: string, suppliedPassword: string): boolean {
  // Split stored password into salt and hash
  const [salt, storedHash] = storedPassword.split(':');
  
  // Hash the supplied password with the same salt
  const suppliedHash = crypto.pbkdf2Sync(suppliedPassword, salt, 1000, 64, 'sha512').toString('hex');
  
  // Compare the hashes
  return storedHash === suppliedHash;
}

export async function POST(req: Request) {
  console.log('Login API route called');
  
  try {
    // Get request body
    const body = await req.json();
    console.log('Request body received:', { ...body, password: '[REDACTED]' });
    
    const { username, password } = body;
    
    // Validate input
    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    try {
      // Connect to database
      const { db } = await connectToDatabase();
      console.log('Database connection successful');
      
      const users = db.collection('users');
      console.log('Retrieved users collection');

      console.log(`Searching for user: ${username}`);
      
      // Find user by username
      const user = await users.findOne({ username });
      
      if (!user) {
        console.log('User not found');
        return NextResponse.json(
          { message: 'Invalid username or password' },
          { status: 401 }
        );
      }

      // Verify password
      console.log('Verifying password...');
      const isPasswordValid = verifyPassword(user.password, password);
      
      if (!isPasswordValid) {
        console.log('Invalid password');
        return NextResponse.json(
          { message: 'Invalid username or password' },
          { status: 401 }
        );
      }

      console.log('Login successful');
      return NextResponse.json(
        { 
          message: 'Login successful',
          username: user.username
        }, 
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return NextResponse.json(
        { message: 'Database error occurred' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login process error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}