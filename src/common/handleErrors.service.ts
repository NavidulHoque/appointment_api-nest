import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class HandleErrorsService {

    throwNotFoundError(message: string) {
        throw new NotFoundException(message)
    }

    throwBadRequestError(message: string) {
        throw new BadRequestException(message);
    }
    
    throwUnauthorizedError(message: string) {
        throw new UnauthorizedException(message);
    }
    
    throwForbiddenError(message: string) {
        throw new ForbiddenException(message);
    }
}
