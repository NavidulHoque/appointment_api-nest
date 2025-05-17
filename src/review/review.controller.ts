import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewDto } from './dto';

@Controller('review')
export class ReviewController {

    constructor(
        private readonly reviewService: ReviewService
    ) { }

    @Post("/create-review")
    async createReview(@Body() reviewDto: ReviewDto) {
        return this.reviewService.createReview(reviewDto);
    }
}

