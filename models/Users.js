const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      length: 11,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    salt: {
      type: String,
      required: true,
    },
    isverified: {
      type: Boolean,
      default: false,
    },

    lastlogin: {
      type: Date,
    },

    regDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.setPassword = async function (pwd) {
  if (pwd.length >= 6) {
    this.salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(pwd, this.salt);
  } else {
    throw new Error("Password should have at least 6 characters");
  }
};

module.exports = mongoose.model("user", UserSchema);
