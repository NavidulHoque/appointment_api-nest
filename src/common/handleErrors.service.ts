import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class HandleErrorsService {

    throwNotFoundError(message: string) {
        throw new NotFoundException(message, {
            cause: new Error(),
            description: 'Resources not found',
        })
    }

    throwBadRequestError(message: string) {
        throw new BadRequestException(message, {
            cause: new Error(),
            description: 'Your requested data is not valid',
        });
    }

    throwUnauthorizedError(message: string) {
        throw new UnauthorizedException(message, {
            cause: new Error(),
            description: 'Your certain action is unauthorized',
        });
    }

    throwForbiddenError(message: string) {
        throw new ForbiddenException(message, {
            cause: new Error(),
            description: 'Your certain action is forbidden',
        });
    }
}
