import mongoose from "mongoose";

const { Schema } = mongoose

export const AppointmentSchema = new Schema({

    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
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
