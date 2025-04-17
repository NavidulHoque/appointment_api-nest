import { Injectable } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {

    constructor(
        private prisma: PrismaService,
        private handleErrorsService: HandleErrorsService
    ) { }

    getUser(user: UserDto) {
        const { fullName, email, phone, gender, birthDate, address } = user
        return { fullName, email, phone, gender, birthDate, address }
    }

    updateUser(dto: UserDto, user: any) {
        const { id } = user
        const { fullName, email, phone, gender, birthDate, address } = dto

        try {
            const updatedUser = this.prisma.user.update({
                where: { id },
                data: { fullName, email, phone, gender, birthDate, address }
            })

            return {
                message: 'User updated successfully',
                user: updatedUser
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }
}
