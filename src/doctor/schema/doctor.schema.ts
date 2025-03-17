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
        min: [1, 'Experience must be at least 1 year']
    },

    contact: {
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
            match: [/^\d{11}$/, 'Doctor phone number must be exactly 11 digits']
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
            required: [true, 'Start time is required'],
            match: [/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, 'Invalid time format, for example use 03:00 PM format']
        },  
        end: { 
            type: String, 
            required: [true, 'End time is required'],
            match: [/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, 'Invalid time format, for example use 03:00 PM format']
        }, 
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

