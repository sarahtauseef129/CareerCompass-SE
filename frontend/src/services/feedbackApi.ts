//feedbackApi.ts
import { apiCall } from './api';

export interface FeedbackResponseDto {
  id: number;
  message: string;
  rating: number;
  createdAt: string;
}

export async function submitFeedback(message: string, rating: number): Promise<FeedbackResponseDto> {
  return apiCall<FeedbackResponseDto>('/feedback', {
    method: 'POST',
    body: JSON.stringify({ message, rating }),
  });
}

export async function getFeedbackHistory(): Promise<FeedbackResponseDto[]> {
  return apiCall<FeedbackResponseDto[]>('/feedback');
}