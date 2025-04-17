import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard';
import { User } from './decorator';
import { UserService } from './user.service';
import { UserDto } from './dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Get("")
    getUser(@User() user: UserDto) {
        return this.userService.getUser(user)
    }

    @Put("")
    updateUser(@Body() dto: UserDto, @User() user: any) {
        this.userService.updateUser(dto, user)
    }

    @Delete("")
    deleteUser(@User() user: any) {
        return this.userService.deleteUser(user)
    }
}
