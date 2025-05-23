export const appointmentSelect = {
    id: true,
    doctor: {
        select: {
            id: true,
            fullName: true,
            email: true,
        }
    },
    patient: {
        select: {
            id: true,
            fullName: true,
            email: true,
        },
    },
    date: true,
    status: true,
    cancellationReason: true,
    isPaid: true,
    paymentMethod: true
}