/* eslint-disable prettier/prettier */

import * as mongoose from "mongoose";
import * as argon from "argon2";

const { Schema } = mongoose

export const UserSchema = new Schema({

    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, "Username already exists"],
        trim: true,
        minLength: [5, 'Username must be at least 5 characters long'],
        maxLength: [10, 'Username cannot exceed 10 characters'],
        match: [/^[a-zA-Z0-9]+$/, 'Username can only contain alphanumeric characters (no special characters and space are allowed)'],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters long'],
        match: [
            /^(?=.*\d)(?=.*[\W_]).{8,}$/,
            'Password must contain at least one number and one special character',
        ],
    },

}, { timestamps: true })


UserSchema.pre('save', async function (next) {

    const hashedPassword = await argon.hash(this.password)
    this.password = hashedPassword
    next()
})