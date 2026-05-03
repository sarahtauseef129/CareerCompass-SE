import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { BookmarkResponseDto } from './dto/bookmark-response.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepo: Repository<Bookmark>,
  ) {}

  // UC-23: Bookmark a career
  async addBookmark(
    userId: number,
    dto: CreateBookmarkDto,
  ): Promise<BookmarkResponseDto> {
    const existing = await this.bookmarkRepo.findOne({
      where: { user: { id: userId }, career: { id: dto.careerId } },
    });

    if (existing) {
      throw new ConflictException('Career is already bookmarked');
    }

    const bookmark = this.bookmarkRepo.create({
      user: { id: userId },
      career: { id: dto.careerId },
    });

    const saved = await this.bookmarkRepo.save(bookmark);
    const loaded = await this.bookmarkRepo.findOne({
     where: { id: saved.id },
     relations: ['career'],
});

    if (!loaded) {
     throw new NotFoundException('Bookmark not found after saving');
}

return this.mapToDto(loaded);
  }

  // UC-24: Get all bookmarked careers for a user
  async getBookmarks(userId: number): Promise<BookmarkResponseDto[]> {
    const bookmarks = await this.bookmarkRepo.find({
      where: { user: { id: userId } },
      relations: ['career'],
      order: { createdAt: 'DESC' },
    });

    return bookmarks.map((b) => this.mapToDto(b));
  }

  // UC-25: Remove a bookmark
  async removeBookmark(userId: number, careerId: number): Promise<void> {
    const bookmark = await this.bookmarkRepo.findOne({
      where: { user: { id: userId }, career: { id: careerId } },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    await this.bookmarkRepo.remove(bookmark);
  }

  private mapToDto(bookmark: Bookmark): BookmarkResponseDto {
    return {
      id: bookmark.id,
      careerId: bookmark.career?.id,
      careerTitle: bookmark.career?.title,
      careerDescription: bookmark.career?.description,
      createdAt: bookmark.createdAt,
    };
  }
async resetAll(): Promise<void> {
  await this.bookmarkRepo.query('DELETE FROM bookmark');
}
}