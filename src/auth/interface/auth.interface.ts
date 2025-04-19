export interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
    phone: string | null | undefined;
    gender: string | null | undefined;
    address: string | null | undefined;
    birthDate: Date | null | undefined;
    password: string;
}