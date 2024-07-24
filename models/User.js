const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true,
        select: false, // this field (password) won't be part of the document fields when queried.
    },

    role: {
        type: String,
        enum: ['Admin', 'Author'],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update the updatedAt field before save
UserSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Document pre save middleware/hook
UserSchema.pre("save", async function (next) {
    // If password path/field is unmodified (create or save) returns
    if (!this.isModified("password")) return next();
    // Salts and Hashes the password
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
});

// All documents created from this schema would have access to these methods

UserSchema.methods.correctPassword = async function (
    enteredPassword,
    userHashedPassword
  ) {
    return await bcrypt.compare(enteredPassword, userHashedPassword);
};

// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;