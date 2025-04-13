import * as mongoose from "mongoose";
import * as argon from "argon2";

const { Schema } = mongoose

export const UserSchema = new Schema({

    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minLength: [5, 'Full name must be at least 5 characters long'],
        match: [/^[a-zA-Z. ]+$/, 'Full name can only contain alphabetic characters, space and dot (no special characters and numbers are allowed)'],
    },

    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, 'Patient email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },

    role: {
        type: String,
        enum: ["patient", "doctor", "admin"],
        default: "patient"
    },

    phone: {
        type: String,
        trim: true,
        match: [/^\d{11}$/, 'Phone number must be exactly 11 digits']
    },

    gender:{
        type: String,
        enum: ["male", "female", "other"],
    },

    birthDate: {
        type: Date,
    },

    address: {
        type: String,
        trim: true,
        minLength: [5, 'Address must be at least 5 characters long'],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters long'],
        match: [
            /^(?=.*\d)(?=.*[\W_]).{8,}$/,
            'Password must contain at least one number and one special character',
        ],
    }

}, { timestamps: true })


UserSchema.pre('save', async function (next) {

    const hashedPassword = await argon.hash(this.password)
    this.password = hashedPassword
    next()
})