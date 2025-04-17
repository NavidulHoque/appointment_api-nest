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
        visitDate: {
            type: Date,
            required: [true, 'Date is required'],
            validate: {
                validator: function (value: Date) {
                    return value.getTime() > new Date().getTime();
                },
                message: 'Date must be in the future'
            }
        }
    }]

}, { timestamps: true })


