import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';

async function createAdminUser() {
  try {
    // Admin credentials to add to database
    const adminUsername = "spiritx_2025";
    const adminPassword = "SpiritX@2025";
    
    // Connect to database
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ username: adminUsername });
    if (existingAdmin) {
      console.log('Admin user already exists with the following details:');
      console.log({
        username: existingAdmin.username,
        isAdmin: existingAdmin.isAdmin,
        createdAt: existingAdmin.createdAt
      });
      
      // Verify password is correct - update it if needed
      const passwordValid = await bcrypt.compare(adminPassword, existingAdmin.password);
      if (!passwordValid) {
        console.log('Updating admin password...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await usersCollection.updateOne(
          { username: adminUsername },
          { $set: { password: hashedPassword } }
        );
        console.log('Admin password updated successfully');
      }
      return;
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    
    // Create admin document
    const adminUser = {
      username: adminUsername,
      email: "admin@spiritx.com", // Add email field
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if user exists with this email
    const emailExists = await usersCollection.findOne({ email: adminUser.email });
    if (emailExists) {
      console.log('Updating existing admin user with matching email...');
      await usersCollection.updateOne(
        { email: adminUser.email },
        { $set: { 
            username: adminUsername, 
            password: hashedPassword, 
            isAdmin: true,
            updatedAt: new Date()
          } 
        }
      );
      console.log('Admin user updated successfully');
    } else {
      // Insert into database
      const result = await usersCollection.insertOne(adminUser);
      console.log('Admin user created successfully with ID:', result.insertedId);
    }
    
    // Verify the admin was created properly
    const verifyAdmin = await usersCollection.findOne({ username: adminUsername });
    if (verifyAdmin) {
      console.log('Verified admin user exists in database:');
      console.log({
        username: verifyAdmin.username,
        isAdmin: verifyAdmin.isAdmin,
        createdAt: verifyAdmin.createdAt
      });
    } else {
      console.error('Failed to verify admin user creation!');
    }
    
    // List all admin users for debugging
    const allAdmins = await usersCollection.find({ isAdmin: true }).toArray();
    console.log(`Found ${allAdmins.length} admin users in database:`);
    allAdmins.forEach(admin => {
      console.log(`- ${admin.username} (created: ${admin.createdAt})`);
    });
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
}

createAdminUser();
