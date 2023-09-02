const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Optional: Disable the "strictQuery" option if needed
    // mongoose.set('strictQuery', false);

    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`.red.bold);
    // Handle the error appropriately (e.g., exit the application or take other actions)
    process.exit(1);
  }
};

module.exports = connectDB;
