import { Injectable } from '@nestjs/common';
import * as argon from "argon2";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FetchUserService } from 'src/common/fetchUser.service';
import { LoginDto, RegistrationDto } from './dto';
import { AuthUser } from './interface';

@Injectable({})
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private handleErrorsService: HandleErrorsService,
    private fetchUserService: FetchUserService,
  ) { }

  async register(dto: RegistrationDto) {

    const { email, password } = dto

    try {

      const user = await this.fetchUserService.fetchUser(email)

      if (user) {
        this.handleErrorsService.throwBadRequestError("User already exists")
      }

      const hashedPassword = await argon.hash(password);

      dto.password = hashedPassword

      await this.prisma.user.create({ data: dto })

      return { message: 'User created successfully' }
    }

    catch (error) {
      this.handleErrorsService.handleError(error)
    }
  }

  async login(dto: LoginDto) {

    const { email, password: plainPassword } = dto

    try {
      const user = await this.fetchUserService.fetchUser(email)

      if (!user) this.handleErrorsService.throwBadRequestError("User not found");

      const { password: hashedPassword } = user as AuthUser;

      const isMatched = await this.comparePassword(plainPassword, hashedPassword)

      if (!isMatched) this.handleErrorsService.throwBadRequestError("Password invalid")

      const payload = { id: user?.id }

      const accessToken = await this.generateAccessToken(payload)
      const refreshToken = await this.generateRefreshToken(payload)

      const updatedUser = await this.prisma.user.update({
        where: { id: user?.id },
        data: { refreshToken },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          refreshToken: true
        },
      })

      return {
        message: 'Logged in successfully',
        data: updatedUser,
        accessToken
      }
    }

    catch (error) {
      throw error; //throws server error
    }
  }

  private async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const isMatched = await argon.verify(hashedPassword, plainPassword)

    return isMatched
  }

  private async generateAccessToken(payload: { id: string | undefined }): Promise<string> {

    const accessTokenSecrete = this.config.get<string>('ACCESS_TOKEN_SECRET')
    const accessTokenExpires = this.config.get<string>('ACCESS_TOKEN_EXPIRES')

    const accessToken = this.jwtService.sign(payload, { secret: accessTokenSecrete, expiresIn: accessTokenExpires });

    return accessToken
  }

  private async generateRefreshToken(payload: { id: string | undefined }): Promise<string> {

    const refreshTokenSecrete = this.config.get<string>('REFRESH_TOKEN_SECRET')
    const refreshTokenExpires = this.config.get<string>('REFRESH_TOKEN_EXPIRES')

    const refreshToken = this.jwtService.sign(payload, { secret: refreshTokenSecrete, expiresIn: refreshTokenExpires });

    return refreshToken
  }

  // async refreshAccessToken(refreshToken: string) {
  //   try {
  //     const user = await this.prisma.user.findFirst({
  //       where: { refreshToken }
  //     })

  //     if (!user) {
  //       this.handleErrorsService.throwBadRequestError('User not found')
  //     }

  //     const accessToken = await this.generateAccessToken({ id: user?.id })

  //     return {
  //       message: 'Refresh token successfully',
  //       data: accessToken
  //     }
  //   }

  //   catch (error) {
  //     throw error; //throws server error
  //   }
  // }

  // async logout(id: string) {

  //   try {
  //     const user = await this.prisma.user.update({
  //       where: { id },
  //       data: { refreshToken: null }
  //     })

  //     return {
  //       message: 'Logged out successfully',
  //       data: user
  //     }
  //   }

  //   catch (error) {
  //     throw error; //throws server error
  //   }
  // }

  // async forgetPassword(email: string) {

  //   try {
  //     if (!email) {
  //       this.handleErrorsService.throwBadRequestError('Email is required')
  //     }

  //     const user = await this.fetchUserService.fetchUser(email)

  //     if (!user) this.handleErrorsService.throwBadRequestError('Invalid Email');

  //     const otp = Math.floor(100000 + Math.random() * 900000);
  //     const otpExpires = new Date(Date.now() + emailExpires);

  //     const { otp } = await this.prisma.user.update({
  //       where: { id: user.id },
  //       data: {
  //         otp: Math.floor(1000 + Math.random() * 9000)
  //       }
  //     })

  //     //send otp to email

  //     return {
  //       message: 'Otp sent successfully',
  //       data: otp
  //     }
  //   }

  //   catch (error) {
  //     throw error; //throws server error
  //   }
  // }

  // async verifyOtp(otp: number, email: string) {
  //   try {
  //     const user = await this.fetchUserService.fetchUser(email)

  //     if (!user) {
  //       this.handleErrorsService.throwBadRequestError('User not found');
  //     }

  //     if (user.otp !== otp) {
  //       this.handleErrorsService.throwBadRequestError('Otp invalid')
  //     }

  //     return {
  //       message: 'Otp verified successfully',
  //     }
  //   }

  //   catch (error) {
  //     throw error; //throws server error
  //   }
  // }

  // async resetPassword(email: string, newPassword: string) {
  //   try {
  //     const user = await this.fetchUserService.fetchUser(email)

  //     if (!user) {
  //       this.handleErrorsService.throwBadRequestError('User not found');
  //     }

  //     const hashedPassword = await argon.hash(newPassword);

  //     await this.prisma.user.update({
  //       where: { id: user.id },
  //       data: { password: hashedPassword }
  //     })

  //     return {
  //       message: 'Password reset successfully',
  //     }
  //   }

  //   catch (error) {
  //     throw error; //throws server error
  //   }
  // }
}