import mongoose from "mongoose";

const { Schema } = mongoose

export const AppointmentSchema = new Schema({

    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },

    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },

    date: {
        type: Date,
        required: [true, 'Date is required']
    },

    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending"
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    paymentMethod: {
        type: String,
        enum: ["cash", "online"]
    }
})
