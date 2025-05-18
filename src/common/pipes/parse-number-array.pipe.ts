import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseNumberArrayPipe implements PipeTransform {
    transform(value: string[] | undefined): number[] | [] {

        if (!value) return []; 

        return value.map(v => {
            const parsed = Number(v);
            if (isNaN(parsed)) {
                throw new BadRequestException(`Invalid number in array: ${v}`);
            }
            return parsed;
        });
    }
}
