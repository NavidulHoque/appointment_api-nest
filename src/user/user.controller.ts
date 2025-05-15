import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard';
import { User } from './decorator';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { AuthUser } from 'src/auth/interface';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Get("")
    getUser(@User() user: any) {
        return this.userService.getUser(user)
    }

    @Put("")
    updateUser(@Body() dto: UserDto, @User() user: AuthUser) {
        this.userService.updateUser(dto, user)
    }

    @Delete("")
    deleteUser(@User() user: AuthUser) {
        return this.userService.deleteUser(user)
    }
}
