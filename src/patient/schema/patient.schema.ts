import {Schema} from "mongoose";

export const PatientSchema = new Schema({

    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },

    doctors: [{
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Doctor ID is required']
    }]

}, { timestamps: true })


