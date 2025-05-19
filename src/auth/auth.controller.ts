import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistrationDto } from './dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post("/register")
    register(@Body() dto: RegistrationDto){
        return this.authService.register(dto)
    }

    @Post("/login")
    login(@Body() dto: LoginDto){
        return this.authService.login(dto)
    }
    
    @Post("/refreshAccessToken")
    async refreshAccessToken(@Body("refreshToken") refreshToken: string){
        return this.authService.refreshAccessToken(refreshToken)
    }

    // @Post("/logout")
    // async logout(){
    //     return this.authService.logout(user)
    // }

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
}
