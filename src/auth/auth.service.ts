import { Inject, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { Model } from 'mongoose';
import { User } from 'src/user/interface';
import * as argon from "argon2";
import { USER_MODEL } from 'src/user/schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HandleErrorsService } from 'src/common/handleErrors.service';

@Injectable({})
export class AuthService {

  constructor(
    @Inject(USER_MODEL)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private config: ConfigService,
    private handleErrorsService: HandleErrorsService
  ) { }

  async register(dto: AuthDto) {

    const { username, password } = dto

    try {

      const user = await this.fetchUser(username)

      if (user) {
        this.handleErrorsService.throwBadRequestError("User already exists")
      }

      const newUser = new this.userModel({ username, password })

      await newUser.save()

      return { message: 'User created successfully' }
    }

    catch (error) {
      this.handleErrorsService.handleError(error)
    }
  }

  async login(dto: AuthDto) {

    const { username, password: plainPassword } = dto

    try {
      const user = await this.fetchUser(username)

      if (!user) {
        this.handleErrorsService.throwBadRequestError("User not found");
      }

      const { _id, password: hashedPassword } = user;

      const isMatched = await this.comparePassword(plainPassword, hashedPassword)

      if (!isMatched) {
        this.handleErrorsService.throwBadRequestError("Password invalid")
      }

      const token = await this.generateToken(user)

      return {
        message: 'Logged in successfully',
        user: { id: _id, username },
        token
      }
    }

    catch (error) {
      throw error; //throws server error
    }
  }

  private async fetchUser(username: string): Promise<any> {

    const user = await this.userModel.findOne({ username })

    return user
  }

  private async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const isMatched = await argon.verify(hashedPassword, plainPassword)

    return isMatched
  }

  private async generateToken(user: any): Promise<string> {

    const { _id, username, fullName, phone, role, email } = user

    const payload = { sub: _id, username, role, fullName, phone, email }
    const secret = this.config.get('JWT_SECRET')

    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '1d'
    })

    return token
  }
}