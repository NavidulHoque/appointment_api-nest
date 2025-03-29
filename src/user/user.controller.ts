import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard';
import { User } from './decorator';
import { AuthDto } from 'src/auth/dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Get("/")
    getUser(@User() user: any) {
        return this.userService.getUser(user)
    }

    @Put("/")
    updateUser(@Body() dto: AuthDto, @User() user: any) {
        this.userService.updateUser(dto, user)
    }
}
