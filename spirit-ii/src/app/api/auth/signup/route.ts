import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import crypto from 'crypto';

// Function to hash password with salt
function hashPassword(password: string): string {
  // Create a random salt
  const salt = crypto.randomBytes(16).toString('hex');
  
  // Hash the password with the salt
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  
  // Return the salt and hash combined
  return `${salt}:${hash}`;
}

export async function POST(req: Request) {
  try {
    // Get request body
    const body = await req.json();
    console.log('Signup request received', { ...body, password: '[REDACTED]' });
    
    const { username, email, password, name } = body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Username, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    try {
      // Connect to database
      const { db } = await connectToDatabase();
      const users = db.collection('users');
      
      // Check if username already exists
      const existingUser = await users.findOne({ username });
      if (existingUser) {
        return NextResponse.json(
          { message: 'Username already taken' },
          { status: 409 }
        );
      }
      
      // Check if email already exists
      const existingEmail = await users.findOne({ email });
      if (existingEmail) {
        return NextResponse.json(
          { message: 'Email already registered' },
          { status: 409 }
        );
      }
      
      // Hash the password
      const hashedPassword = hashPassword(password);
      
      // Create new user
      const newUser = {
        username,
        email,
        password: hashedPassword,
        name: name || username,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Insert into database
      const result = await users.insertOne(newUser);
      
      // Create initial empty team for the user
      const teams = db.collection('teams');
      await teams.insertOne({
        userId: result.insertedId,
        username,
        players: [],
        budget_remaining: 90000000, // Initial budget (90M)
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Add user to leaderboard with 0 points
      const leaderboard = db.collection('leaderboard');
      await leaderboard.insertOne({
        username,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('User registered successfully:', username);
      
      // Return success response (without password)
      return NextResponse.json({
        message: 'Registration successful',
        user: {
          username,
          email,
          name: name || username
        }
      }, { status: 201 });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return NextResponse.json(
        { message: 'Database error occurred' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Registration process error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}