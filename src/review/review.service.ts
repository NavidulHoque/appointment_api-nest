import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReviewDto } from './dto';
import { HandleErrorsService } from 'src/common/handleErrors.service';

@Injectable()
export class ReviewService {
    constructor(
        private prisma: PrismaService,
        private handleErrorsService: HandleErrorsService
    ) { }

    async createReview(dto: ReviewDto) {

        const { patientId, doctorId, comment, rating } = dto;

        try {
            const review = await this.prisma.review.create({
                data: {
                    patientId,
                    doctorId,
                    comment,
                    rating
                }
            })

            return {
                data: review,
                message: "Review created successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }
}
