import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistrationDto } from './dto';
import { AuthGuard } from './guard';
import { User } from 'src/user/decorator';
import { UserDto } from 'src/user/dto';
import { CheckRoleService } from 'src/common/checkRole.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private checkRoleService: CheckRoleService
    ){}

    @Post("/register")
    register(@Body() dto: RegistrationDto){
        return this.authService.register(dto)
    }

    @Post("/patientLogin")
    patientLogin(@Body() dto: LoginDto){
        return this.authService.patientLogin(dto)
    }

    @Post("/doctorLogin")
    doctorLogin(@Body() dto: LoginDto){
        return this.authService.doctorLogin(dto)
    }

    @Post("/adminLogin")
    adminLogin(@Body() dto: LoginDto){
        return this.authService.adminLogin(dto)
    }

    // @Post("/forgetPassword")
    // forgetPassword(@Body("email") email: string){
    //     return this.authService.forgetPassword(email)
    // }

    // @Post("/verifyOtp")
    // verifyOtp(@Body() dto: {email: string, otp: string}){
    //     return this.authService.verifyOtp(dto.email, dto.otp)
    // }

    // @Post("/resetPassword")
    // resetPassword(@Body() dto: {email: string, newPassword: string}){
    //     return this.authService.resetPassword(dto.email, dto.newPassword)
    // }

    // @UseGuards(AuthGuard)
    // @Post("/refreshAccessToken")
    // async refreshAccessToken(
    //     @User() user: UserDto
    // ){
    //     this.checkRoleService.checkIsAdminOrPatientOrDoctor(user.role)
    //     return this.authService.refreshAccessToken(user.refreshToken as string)
    // }

    // @Post("/logout")
    // async logout(){
    //     return this.authService.logout(user)
    // }
}
