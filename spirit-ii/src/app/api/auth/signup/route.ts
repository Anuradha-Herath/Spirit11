import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    
    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Check if username or email already exists
    const existingUser = await usersCollection.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    });
    
    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json({ message: 'Username already taken' }, { status: 409 });
      }
      if (existingUser.email === email) {
        return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
      }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await usersCollection.insertOne(newUser);
    
    // Don't return the password
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error in signup:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}