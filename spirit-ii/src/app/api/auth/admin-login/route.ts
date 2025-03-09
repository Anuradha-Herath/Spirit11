import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    console.log(`Admin login attempt for username: ${username}`);
    
    // Validate required fields
    if (!username || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Find user with username and check if they are an admin (case-insensitive)
    const user = await usersCollection.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, "i") },
      isAdmin: true 
    });
    
    console.log(`Admin user found: ${user ? 'Yes' : 'No'}`);
    
    // If no admin user found with that username
    if (!user) {
      // Check if user exists but isn't an admin
      const anyUser = await usersCollection.findOne({ 
        username: { $regex: new RegExp(`^${username}$`, "i") }
      });
      
      if (anyUser) {
        console.log('User exists but is not an admin. isAdmin value:', anyUser.isAdmin);
        return NextResponse.json({ 
          message: 'This user account does not have admin privileges', 
          errorType: 'not_admin' 
        }, { status: 403 });
      } else {
        console.log('No user with this username exists in database');
        return NextResponse.json({ 
          message: 'User not found', 
          errorType: 'user_not_found' 
        }, { status: 404 });
      }
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match: ${passwordMatch ? 'Yes' : 'No'}`);
    
    if (!passwordMatch) {
      return NextResponse.json({ 
        message: 'Incorrect password', 
        errorType: 'wrong_password' 
      }, { status: 401 });
    }
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      ...userWithoutPassword,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Error in admin login:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
