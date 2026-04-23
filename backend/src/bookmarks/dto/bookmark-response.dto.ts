//bookmark-response.dto.ts
export class BookmarkResponseDto {
  id: number;
  careerId: number;
  careerTitle: string;
  careerDescription?: string;
  createdAt: Date;
}