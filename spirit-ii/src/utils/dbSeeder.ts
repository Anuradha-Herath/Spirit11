import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';

/**
 * Seeds the database with initial data including admin users
 */
export async function seedDatabase() {
  try {
    console.log('Starting database seeding process...');
    const { db } = await connectToDatabase();
    
    // Seed admin users
    await seedAdminUsers(db);
    
    console.log('Database seeding completed successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

/**
 * Creates admin users if they don't exist
 */
async function seedAdminUsers(db: any) {
  const usersCollection = db.collection('users');
  
  // Check if admin user exists
  const adminUser = await usersCollection.findOne({ 
    username: "spiritx_2025" 
  });
  
  if (!adminUser) {
    console.log('Admin user not found. Creating admin user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash("SpiritX@2025", 10);
    
    // Create admin user
    await usersCollection.insertOne({
      username: "spiritx_2025",
      email: "admin@spirit11.com",
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }
}
