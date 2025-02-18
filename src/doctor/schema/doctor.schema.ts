/* eslint-disable prettier/prettier */
import mongoose from "mongoose";

const { Schema } = mongoose;

export const DoctorSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true,
        minLength: [5, 'Doctor name must be at least 5 characters long'],
        match: [/^[a-zA-Z. ]+$/, 'Doctor name can only contain alphabetic characters, space, and dot (no special characters and numbers are allowed)'],
    },

    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        trim: true,
    },

    experience: {
        type: Number,
        required: [true, 'Experience is required'],
        min: [1, 'Experience must be at least 1 year'],
    },

    contact: {
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^\d{10,15}$/, 'Invalid phone number format'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        }
    },

    workingHours: {
        start: { 
            type: String, 
            required: true 
        },  // Example: "09:00 AM"
        end: { 
            type: String, 
            required: true 
        },    // Example: "05:00 PM"
    },

    isActive: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

