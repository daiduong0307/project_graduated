var mongoose = require("mongoose");
const validator = require('validator')
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    fullName: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: Number,
        trim: true,
    },
    age: {
        type: Number,
        default: 0,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a + number')
            }
        }
    },
    dayOfBirth: {
        type: String
    },
    avatar: {
        type: String,
        default: "boy.png"
    },
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoleUser",
    }
},
    {
        timestamps: true
    });

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
