import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseNumberArrayPipe implements PipeTransform {
    transform(value: string[] | string | undefined): number[] | [] {

        if (!value) return [];

        if (typeof value === 'string') {
            throw new BadRequestException(`Invalid query, send minimum 2 numbers in array`);
        }

        return value.map(v => {
            const parsed = Number(v);
            if (isNaN(parsed)) {
                throw new BadRequestException(`Invalid number in array: ${v}`);
            }
            return parsed;
        });
    }
}
