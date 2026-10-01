const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    //console.log('URI being used:', process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@'));
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;