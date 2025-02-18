export interface AppointmentDto {
    patientName: string;
    contactInformation: { phone: string, email: string };
    date: string;
    time: string;
    doctorId: string;
}