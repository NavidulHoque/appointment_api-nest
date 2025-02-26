export interface DoctorDto {
    name: string;
    specialization: string;
    experience: number;
    contact: {phone: string, email: string};
    workingHours: {start: string, end: string};
    isActive: boolean;
}