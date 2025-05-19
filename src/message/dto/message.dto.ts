import { IsString, IsBoolean } from 'class-validator';

export class MessageDto {
    @IsString()
    content: string;

    @IsString()
    senderId: string;

    @IsString()
    receiverId: string;
}

