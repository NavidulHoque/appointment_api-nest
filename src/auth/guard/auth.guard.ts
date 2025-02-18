import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            this.throwUnauthorizedError("No token provided, please login")
        }

        const secret = this.config.get('JWT_SECRET')

        try {
            const payload = await this.jwtService.verifyAsync(token as string, { secret })

            request['user'] = payload;
        }

        catch (error) {

            if (error.name === "TokenExpiredError") {
                this.throwUnauthorizedError("Token expired, please login again")
            }

            else if (error.name === "JsonWebTokenError") {
                this.throwUnauthorizedError("Invalid token, please login again");
            }

            else if (error.name === "NotBeforeError") {
                this.throwUnauthorizedError("Token not active yet, please login again");
            }

            throw error
        }

        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private throwUnauthorizedError(message: string): void {
        throw new UnauthorizedException(message);
    }
}