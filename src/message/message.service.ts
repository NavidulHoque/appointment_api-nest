import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from './dto';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { UserDto } from 'src/user/dto';

@Injectable()
export class MessageService {

    constructor(
        private prisma: PrismaService,
        private handleErrorsService: HandleErrorsService
    ) { }

    async createMessage(dto: MessageDto) {
        try {
            const message = await this.prisma.message.create({ data: dto });

            return {
                data: message,
                message: "Message created successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }


    async getMessages(user: UserDto, receiverId: string) {

        const { id } = user

        try {
            const messages = await this.prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: id, receiverId },
                        { senderId: receiverId, receiverId: id }
                    ]
                },
                orderBy: { createdAt: 'desc' }
            });

            return {
                data: messages,
                message: "Messages fetched successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async deleteMessage(id: string, user: UserDto) {

        const { id: userId } = user

        try {
            const message = await this.prisma.message.findUnique({ where: { id } });

            if (!message) this.handleErrorsService.throwNotFoundError("Message not found")

            if (message?.senderId !== userId || message?.receiverId !== userId) {
                this.handleErrorsService.throwForbiddenError("You are not authorized to delete this message")
            }

            await this.prisma.message.delete({ where: { id } });

            return {
                message: "Message deleted successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }
}
