import { Inject, Injectable } from '@nestjs/common';
import { USER_MODEL } from './schema';
import { Model } from 'mongoose';
import { User } from './interface';
import { AuthDto } from 'src/auth/dto';
import { HandleErrorsService } from 'src/common/handleErrors.service';

@Injectable()
export class UserService {

    constructor(
        @Inject(USER_MODEL)
        private userModel: Model<User>,
        private handleErrorsService: HandleErrorsService
    ) { }

    getUser(user: any) {
        const { username, fullName, phone, email } = user
        return { username, fullName, phone, email }
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
