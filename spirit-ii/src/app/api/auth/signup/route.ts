import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import * as crypto from 'crypto';

// Function to hash password with crypto instead of bcrypt
function hashPassword(password: string): string {
  // Generate a random salt
  const salt = crypto.randomBytes(16).toString('hex');
  // Hash the password with the salt
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  // Return salt and hash combined
  return `${salt}:${hash}`;
}

export async function POST(req: Request) {
  console.log('Signup API route called');
  
  try {
    // Get request body
    const body = await req.json();
    console.log('Request body received:', { ...body, password: '[REDACTED]' });
    
    const { username, password } = body;
    console.log(`Attempting to create user: ${username}`);
    
    // Validate input
    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('Password too short');
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    
    try {
      // Connect to database
      const { db } = await connectToDatabase();
      console.log('Database connection successful');
      
      const users = db.collection('users');
      console.log('Retrieved users collection');

      console.log('Checking if user exists...');
      
      // Check if user exists
      const existingUser = await users.findOne({ username });
      if (existingUser) {
        console.log('Username already exists');
        return NextResponse.json(
          { message: 'Username already exists' },
          { status: 409 }
        );
      }

      // Hash password using our custom function
      console.log('Hashing password...');
      const hashedPassword = hashPassword(password);

      // Insert user
      console.log('Inserting new user into database...');
      const result = await users.insertOne({
        username,
        password: hashedPassword,
        createdAt: new Date(),
        team: []
      });

      console.log('User created successfully with ID:', result.insertedId);
      return NextResponse.json(
        { 
          message: 'User created successfully',
          userId: result.insertedId,
          username 
        }, 
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return NextResponse.json(
        { message: 'Database error occurred', details: dbError instanceof Error ? dbError.message : 'Unknown database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Signup process error:', error);
    return NextResponse.json(
      { message: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}