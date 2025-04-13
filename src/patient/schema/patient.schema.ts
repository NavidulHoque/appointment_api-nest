import { Schema } from "mongoose";

export const PatientSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },

    doctors: [{
        doctor: {
            type: Schema.Types.ObjectId,
            ref: 'Doctor',
            required: [true, 'Doctor ID is required']
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
    }]

}, { timestamps: true })


