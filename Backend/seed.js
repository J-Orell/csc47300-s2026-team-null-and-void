const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Budget = require('./models/Budget');
const Transaction = require('./models/Transaction');
const SavingsGoal = require('./models/SavingsGoal');
const Settings = require('./models/Settings');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    const mongoDbName = process.env.MONGO_DB_NAME || 'budgetbuddy';
    await mongoose.connect(process.env.MONGO_URI, { dbName: mongoDbName });
    console.log(`✅ Connected to MongoDB (database: ${mongoose.connection.db.databaseName})`);

    // Clear existing data
    console.log('🗑️  Clearing existing collections...');
    await User.deleteMany({});
    await Budget.deleteMany({});
    await Transaction.deleteMany({});
    await SavingsGoal.deleteMany({});
    await Settings.deleteMany({});

    // Create test users
    console.log('👥 Creating test users...');
    const user1 = await User.create({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'Test@123456',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      isActive: true,
    });

    const user2 = await User.create({
      username: 'janedoe',
      email: 'jane@example.com',
      password: 'Test@123456',
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'user',
      isActive: true,
    });

    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin@123456',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    });

    console.log(`✅ Created 3 users (${user1._id}, ${user2._id}, ${adminUser._id})`);

    // Create settings for users
    console.log('⚙️  Creating user settings...');
    await Settings.create({
      userId: user1._id,
      theme: 'light',
      currency: 'USD',
      notificationsEnabled: true,
    });

    await Settings.create({
      userId: user2._id,
      theme: 'dark',
      currency: 'USD',
      notificationsEnabled: true,
    });

    await Settings.create({
      userId: adminUser._id,
      theme: 'light',
      currency: 'USD',
      notificationsEnabled: true,
    });

    console.log('✅ Created user settings');

    // Create budgets for user1
    console.log('💰 Creating budgets...');
    const budget1 = await Budget.create({
      userId: user1._id,
      name: 'Monthly Groceries',
      category: 'Food',
      budgetedAmount: 500,
      spentAmount: 320,
      month: new Date('2026-05-01'),
      description: 'Weekly grocery shopping and dining',
    });

    const budget2 = await Budget.create({
      userId: user1._id,
      name: 'Transportation',
      category: 'Transportation',
      budgetedAmount: 300,
      spentAmount: 150,
      month: new Date('2026-05-01'),
      description: 'Gas, parking, and public transport',
    });

    const budget3 = await Budget.create({
      userId: user1._id,
      name: 'Entertainment',
      category: 'Entertainment',
      budgetedAmount: 200,
      spentAmount: 85,
      month: new Date('2026-05-01'),
      description: 'Movies, games, and hobbies',
    });

    console.log('✅ Created 3 budgets');

    // Create transactions for user1
    console.log('📊 Creating transactions...');
    await Transaction.create({
      userId: user1._id,
      description: 'Whole Foods grocery shopping',
      amount: 125.50,
      category: 'Food',
      type: 'expense',
      date: new Date('2026-05-10'),
      budget: budget1._id,
      notes: 'Weekly groceries',
    });

    await Transaction.create({
      userId: user1._id,
      description: 'Trader Joe\'s',
      amount: 95.30,
      category: 'Food',
      type: 'expense',
      date: new Date('2026-05-12'),
      budget: budget1._id,
      notes: 'Organic produce',
    });

    await Transaction.create({
      userId: user1._id,
      description: 'Uber to work',
      amount: 15.75,
      category: 'Transportation',
      type: 'expense',
      date: new Date('2026-05-08'),
      budget: budget2._id,
    });

    await Transaction.create({
      userId: user1._id,
      description: 'Gas station',
      amount: 60.00,
      category: 'Transportation',
      type: 'expense',
      date: new Date('2026-05-09'),
      budget: budget2._id,
    });

    await Transaction.create({
      userId: user1._id,
      description: 'Movie tickets',
      amount: 35.00,
      category: 'Entertainment',
      type: 'expense',
      date: new Date('2026-05-11'),
      budget: budget3._id,
    });

    await Transaction.create({
      userId: user1._id,
      description: 'Monthly salary',
      amount: 4500.00,
      category: 'Income',
      type: 'income',
      date: new Date('2026-05-01'),
      notes: 'May salary',
    });

    console.log('✅ Created 6 transactions');

    // Create savings goals for user1
    console.log('🎯 Creating savings goals...');
    const goal1 = await SavingsGoal.create({
      userId: user1._id,
      name: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 2500,
      deadline: new Date('2026-12-31'),
      category: 'Emergency Fund',
      description: '6 months of living expenses',
      status: 'active',
    });

    const goal2 = await SavingsGoal.create({
      userId: user1._id,
      name: 'Vacation to Hawaii',
      targetAmount: 2000,
      currentAmount: 750,
      deadline: new Date('2026-08-31'),
      category: 'Vacation',
      description: 'Summer vacation',
      status: 'active',
    });

    const goal3 = await SavingsGoal.create({
      userId: user1._id,
      name: 'New Laptop',
      targetAmount: 1500,
      currentAmount: 1500,
      deadline: new Date('2026-06-30'),
      category: 'Other',
      description: 'MacBook Pro',
      status: 'completed',
    });

    console.log('✅ Created 3 savings goals');

    // Create budgets for user2
    console.log('💰 Creating more budgets...');
    await Budget.create({
      userId: user2._id,
      name: 'Rent',
      category: 'Housing',
      budgetedAmount: 1200,
      spentAmount: 1200,
      month: new Date('2026-05-01'),
      description: 'Monthly rent',
    });

    await Budget.create({
      userId: user2._id,
      name: 'Utilities',
      category: 'Utilities',
      budgetedAmount: 150,
      spentAmount: 120,
      month: new Date('2026-05-01'),
      description: 'Electric, water, internet',
    });

    console.log('✅ Created additional budgets');

    // Create transactions for user2
    console.log('📊 Creating more transactions...');
    await Transaction.create({
      userId: user2._id,
      description: 'Monthly salary',
      amount: 3500.00,
      category: 'Income',
      type: 'income',
      date: new Date('2026-05-01'),
      notes: 'May salary',
    });

    await Transaction.create({
      userId: user2._id,
      description: 'Rent payment',
      amount: 1200.00,
      category: 'Housing',
      type: 'expense',
      date: new Date('2026-05-01'),
    });

    console.log('✅ Created additional transactions');

    // Summary
    console.log('\n📊 Database Seeding Complete!\n');
    console.log('Collections created:');
    console.log('  👥 Users: 3 (John Doe, Jane Doe, Admin)');
    console.log('  ⚙️  Settings: 3');
    console.log('  💰 Budgets: 5');
    console.log('  📊 Transactions: 9');
    console.log('  🎯 Savings Goals: 3');
    console.log('\n🔑 Test Credentials:');
    console.log('  User 1: john@example.com / Test@123456');
    console.log('  User 2: jane@example.com / Test@123456');
    console.log('  Admin: admin@example.com / Admin@123456');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
