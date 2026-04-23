import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackResponseDto } from './dto/feedback-response.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepo: Repository<Feedback>,
  ) {}

  // UC-26: Submit feedback
  async createFeedback(
    userId: number,
    dto: CreateFeedbackDto,
  ): Promise<FeedbackResponseDto> {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const feedback = this.feedbackRepo.create({
      user: { id: userId },
      message: dto.message,
      rating: dto.rating,
    });

    const saved = await this.feedbackRepo.save(feedback);

    return this.mapToDto(saved);
  }

  // UC-27: View feedback history for a user
  async getFeedbackHistory(userId: number): Promise<FeedbackResponseDto[]> {
    const feedbacks = await this.feedbackRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    return feedbacks.map((f) => this.mapToDto(f));
  }

  private mapToDto(feedback: Feedback): FeedbackResponseDto {
    return {
      id: feedback.id,
      message: feedback.message,
      rating: feedback.rating,
      createdAt: feedback.createdAt,
    };
  }
}