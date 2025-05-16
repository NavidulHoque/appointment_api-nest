import {
    CanActivate,
    ExecutionContext,
    Injectable
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
        private handleErrorService: HandleErrorsService,
        private prisma: PrismaService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) this.handleErrorService.throwUnauthorizedError("No token provided, please login")

        const secret = this.config.get('ACCESS_TOKEN_SECRET')

        try {
            const payload = await this.jwtService.verifyAsync(token as string, { secret })

            
            const user = await this.prisma.user.findUnique({ 
                where: { id: payload.id }
            })

            request['user'] = user;
        }

        catch (error) {

            if (error.name === "TokenExpiredError") this.handleErrorService.throwUnauthorizedError("Token expired, please login again")

            else if (error.name === "JsonWebTokenError") this.handleErrorService.throwUnauthorizedError("Invalid token, please login again");

            else if (error.name === "NotBeforeError") this.handleErrorService.throwUnauthorizedError("Token not active yet, please login again");

            throw error
        }

        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}