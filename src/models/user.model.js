const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    surname: {
        type: String,
        trim: true,
        required: true,
    },
    profileImage: {
		type: String,
		trim: true,
		required: false,
		max: 32
	},
	bio: {
		type: String,
		trim: true,
		required: false,
		max: 500
	},
	birthdate:{
		type: Date,
		required: false
	},
	sex: {
		type: String,
		trim: true,
		required: false,
		max: 32	
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