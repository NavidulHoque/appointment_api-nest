import mongoose from "mongoose";

const { Schema } = mongoose;

export const DoctorSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },

    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        trim: true,
    },

    education: {
        type: String,
        required: [true, 'Education is required'],
        trim: true,
        minLength: [5, 'Education must be at least 5 characters long'],
        match: [/^[a-zA-Z., ]+$/, 'Education can only contain alphabetic characters, space, dot and comma (no special characters and numbers are allowed)'],
    },

    experience: {
        type: Number,
        required: [true, 'Experience is required'],
        min: [1, 'Experience must be at least 1 year']
    },

    aboutMe: {
        type: String,
        required: [true, 'About me is required'],
        trim: true,
        minLength: [10, 'About me must be at least 10 characters long'],
        match: [/^[a-zA-Z0-9., ]+$/, 'About me can only contain alphanumeric characters, space, dot and comma (no special characters are allowed)'],
    },

    fees: {
        type: Number,
        min: [20, 'Fees must be a positive number']
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
    },

    patients: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

}, { timestamps: true })

