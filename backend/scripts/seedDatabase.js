const mongoose = require('mongoose');
const connectDB = require('../config/database');

// Import models
const User = require('../models/User');
const Trader = require('../models/Trader');
const Following = require('../models/Following');

// Import mock data
const mockUsers = require('../data/mockUsers');
const mockTraders = require('../data/mockTraders');
const mockFollowing = require('../data/mockFollowing');

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Trader.deleteMany({});
    await Following.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Insert Users
    console.log('👥 Inserting users...');
    const insertedUsers = await User.insertMany(mockUsers);
    console.log(`✅ ${insertedUsers.length} users inserted`);
    
    // Insert Traders
    console.log('📈 Inserting traders...');
    const insertedTraders = await Trader.insertMany(mockTraders);
    console.log(`✅ ${insertedTraders.length} traders inserted`);
    
    // Insert Following relationships
    console.log('🤝 Inserting following relationships...');
    const insertedFollowing = await Following.insertMany(mockFollowing);
    console.log(`✅ ${insertedFollowing.length} following relationships inserted`);
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Display summary
    console.log('\n📊 SEEDING SUMMARY:');
    console.log(`Users: ${insertedUsers.length}`);
    console.log(`Traders: ${insertedTraders.length}`);
    console.log(`Following relationships: ${insertedFollowing.length}`);
    
    // Display some sample data
    console.log('\n🔍 SAMPLE DATA:');
    console.log('Users:');
    insertedUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.walletAddress})`);
    });
    
    console.log('\nTraders:');
    insertedTraders.forEach(trader => {
      console.log(`  - ${trader.displayName} | P&L: $${trader.totalPnL} | Win Rate: ${trader.winRate}%`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();