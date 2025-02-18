/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import mongoose from "mongoose";

const { Schema } = mongoose

export const AppointmentSchema = new Schema({

    patientName: {
        type: String,
        required: [true, 'Patient Name is required'],
        trim: true,
        minLength: [5, 'Patient Name must be at least 5 characters long'],
        match: [/^[a-zA-Z. ]+$/, 'Patient Name can only contain alphabetic characters, space and dot (no special characters and numbers are allowed)'],
    },

    contactInformation: {

        phone: {
            type: String,
            trim: true,
            required: [true, 'Patient phone number is required'],
            match: [/^\d{11}$/, 'Patient phone number must be exactly 11 digits']
        },
        email: {
            type: String,
            trim: true,
            required: [true, 'Patient email is required'],
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
        }
    },

    date: {
        type: String,
        required: [true, 'Date is required'],
        match: [/^[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{4}$/, 'Invalid date format, for example use "Mon Jan 01 2022" format']
    },

    time: {
        type: String,
        required: [true, 'Time is required'],
        match: [/^\d{1,2}:\d{2}:\d{2} [AP]M$/, 'Invalid time format, for example use "3:02:09 PM" format'],
        validate: {
            validator: function (time: string) {

                if (time && this.date) {

                    const fullDateTimeString = `${this.date} ${time}`;
                    const appointmentDateTime = new Date(fullDateTimeString);

                    const currentDateTime = new Date();

                    return appointmentDateTime > currentDateTime;
                }

                return true
            },
            message: "Appointment time must be in the future.",
        },
    },

    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Doctor ID is required']
    },
})
