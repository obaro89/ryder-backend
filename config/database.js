const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongourl");

const connectToDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("connected to database");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectToDB;
