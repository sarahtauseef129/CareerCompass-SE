import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

// Temporary until Person 1's JWT auth is ready
const TEMP_USER_ID = 1;

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // UC-26: Submit feedback
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createFeedback(@Body() dto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(TEMP_USER_ID, dto);
  }

  // UC-27: View feedback history
  @Get()
  @HttpCode(HttpStatus.OK)
  getFeedbackHistory() {
    return this.feedbackService.getFeedbackHistory(TEMP_USER_ID);
  }
}