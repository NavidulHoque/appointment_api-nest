import { Injectable } from '@nestjs/common';
import * as argon from "argon2";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FetchUserService } from 'src/common/fetchUser.service';
import { UserDto } from 'src/user/dto';
import { LoginDto, RegistrationDto } from './dto';

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

      if (!user) {
        this.handleErrorsService.throwBadRequestError("User not found");
      }

      const { password: hashedPassword } = user as UserDto;

      const isMatched = await this.comparePassword(plainPassword, hashedPassword)

      if (!isMatched) {
        this.handleErrorsService.throwBadRequestError("Password invalid")
      }

      const payload = { id: user?.id, role: user?.role }

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

  private async generateAccessToken(payload: { id: string | undefined, role: string | undefined }): Promise<string> {

    const accessTokenSecrete = this.config.get<string>('ACCESS_TOKEN_SECRET')
    const accessTokenExpires = this.config.get<string>('ACCESS_TOKEN_EXPIRES')

    const accessToken = this.jwtService.sign(payload, { secret: accessTokenSecrete, expiresIn: accessTokenExpires });

    return accessToken
  }

  private async generateRefreshToken(payload: { id: string | undefined, role: string | undefined }): Promise<string> {

    const refreshTokenSecrete = this.config.get<string>('REFRESH_TOKEN_SECRET')
    const refreshTokenExpires = this.config.get<string>('REFRESH_TOKEN_EXPIRES')

    const refreshToken = this.jwtService.sign(payload, { secret: refreshTokenSecrete, expiresIn: refreshTokenExpires });

    return refreshToken
  }
}