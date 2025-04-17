import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from "argon2";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FetchUserService } from 'src/common/fetchUser.service';
import { Prisma } from '@prisma/client';

@Injectable({})
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private handleErrorsService: HandleErrorsService,
    private fetchUserService: FetchUserService,
  ) { }

  async register(dto: AuthDto) {

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

  async login(dto: AuthDto) {

    const { email, password: plainPassword } = dto

    try {
      const user = await this.fetchUserService.fetchUser(email)

      if (!user) {
        this.handleErrorsService.throwBadRequestError("User not found");
      }

      const { password: hashedPassword } = user as any;

      const isMatched = await this.comparePassword(plainPassword, hashedPassword)

      if (!isMatched) {
        this.handleErrorsService.throwBadRequestError("Password invalid")
      }

      const token = await this.generateToken(user)

      return {
        message: 'Logged in successfully',
        user,
        token
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

  private async generateToken(user: any): Promise<string> {

    const { id } = user

    const payload = { sub: id }
    const secret = this.config.get('JWT_SECRET')

    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '7d'
    })

    return token
  }
}