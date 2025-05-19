import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class OptionalParseBoolPipe implements PipeTransform {
    transform(value: string | undefined): boolean | undefined {
        if (!value) return undefined;

        const val = value?.toLowerCase();
        if (val === 'true') return true;
        if (val === 'false') return false;

        throw new BadRequestException(`Invalid boolean value: ${value}`);
    }
}
