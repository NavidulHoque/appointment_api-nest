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
        const { fullName, email, phone, gender, birthDate, address} = user
        return { fullName, email, phone, gender, birthDate, address}
    }

    updateUser(dto: AuthDto, user: any) {
        const { sub: id } = user
        const { username, fullName, phone, email } = dto

        try {
            const updatedUser = this.userModel.findByIdAndUpdate(id, { $set: { username, fullName, phone, email } }, { new: true })

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
