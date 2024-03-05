const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user"
    },
    reset: {
        code: {
          type: String,
          default: null,
        },
        time: {
          type: String,
          default: null,
        },
      },
}, { collection: "users" ,timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;