import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';

async function checkAdminUsers() {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Get all users
    const allUsers = await usersCollection.find({}).toArray();
    console.log(`Total users in database: ${allUsers.length}`);
    
    // Get all admin users
    const adminUsers = await usersCollection.find({ isAdmin: true }).toArray();
    console.log(`Total admin users: ${adminUsers.length}`);
    
    if (adminUsers.length > 0) {
      console.log('Admin users details:');
      adminUsers.forEach((admin, index) => {
        const { password, ...adminWithoutPassword } = admin;
        console.log(`Admin #${index + 1}:`, adminWithoutPassword);
      });
    } else {
      console.log('No admin users found in the database.');
    }
    
    // Try to find our specific admin
    const expectedAdmin = await usersCollection.findOne({ username: "spiritx_2025" });
    
    if (expectedAdmin) {
      const { password, ...adminInfo } = expectedAdmin;
      console.log('Found our admin user:', adminInfo);
      console.log('Is marked as admin:', expectedAdmin.isAdmin === true);
      
      // Test password match
      const testPassword = "SpiritX@2025";
      const passwordMatch = await bcrypt.compare(testPassword, expectedAdmin.password);
      console.log(`Password "SpiritX@2025" matches: ${passwordMatch ? 'Yes' : 'No'}`);
    } else {
      console.log('Could not find expected admin user (spiritx_2025)');
      
      // Check for case-insensitive match
      const caseInsensitiveAdmin = await usersCollection.findOne({
        username: { $regex: new RegExp("^spiritx_2025$", "i") }
      });
      
      if (caseInsensitiveAdmin) {
        const { password, ...adminInfo } = caseInsensitiveAdmin;
        console.log('Found admin with case-insensitive search:', adminInfo);
        console.log('Actual username in DB:', caseInsensitiveAdmin.username);
        console.log('Is marked as admin:', caseInsensitiveAdmin.isAdmin === true);
      } else {
        console.log('No user with similar username exists');
      }
      
      // Try to create the admin user now
      console.log('Creating admin user...');
      const adminUsername = "spiritx_2025";
      const adminPassword = "SpiritX@2025";
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const adminUser = {
        username: adminUsername,
        email: "admin@spiritx.com",
        password: hashedPassword,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await usersCollection.insertOne(adminUser);
      console.log('Admin user created successfully with username:', adminUsername);
      
      // Verify admin creation
      const verifyAdmin = await usersCollection.findOne({ username: adminUsername });
      if (verifyAdmin) {
        console.log('Admin user verified in database with isAdmin:', verifyAdmin.isAdmin);
      }
    }
    
  } catch (error) {
    console.error('Error checking admin users:', error);
  } finally {
    process.exit();
  }
}

checkAdminUsers();
