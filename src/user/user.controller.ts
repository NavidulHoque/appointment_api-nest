import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard'; 
import { User } from './decorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    @Get("/")
    readUser(@User() user: any){
        const {sub, username} = user
        return {id: sub, username}
    }
}
