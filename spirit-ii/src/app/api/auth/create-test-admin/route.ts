import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST() {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Check for existing admin
    const adminUsername = "spiritx_2025";
    const adminPassword = "SpiritX@2025";
    
    const existingAdmin = await usersCollection.findOne({ 
      username: { $regex: new RegExp(`^${adminUsername}$`, "i") }
    });
    
    if (existingAdmin) {
      // Update the admin flag if needed
      if (existingAdmin.isAdmin !== true) {
        await usersCollection.updateOne(
          { _id: existingAdmin._id },
          { $set: { isAdmin: true } }
        );
        return NextResponse.json({ message: 'Admin flag added to existing user' });
      }
      
      // Update password if needed
      const passwordValid = await bcrypt.compare(adminPassword, existingAdmin.password);
      if (!passwordValid) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await usersCollection.updateOne(
          { _id: existingAdmin._id },
          { $set: { password: hashedPassword } }
        );
        return NextResponse.json({ message: 'Admin password has been updated' });
      }
      
      return NextResponse.json({ message: 'Admin user verified and is correct' });
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const adminUser = {
        username: adminUsername,
        password: hashedPassword,
        isAdmin: true,
        createdAt: new Date()
      };
      
      await usersCollection.insertOne(adminUser);
      return NextResponse.json({ message: 'Admin user created successfully' });
    }
  } catch (error) {
    console.error('Error in admin account verification:', error);
    return NextResponse.json({ message: 'Error checking admin account' }, { status: 500 });
  }
}
