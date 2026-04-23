//bookmarks.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

// Temporary until Person 1's JWT auth is ready
const TEMP_USER_ID = 1;

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  // UC-23: Bookmark a career
  @Post()
  @HttpCode(HttpStatus.CREATED)
  addBookmark(@Body() dto: CreateBookmarkDto) {
    return this.bookmarksService.addBookmark(TEMP_USER_ID, dto);
  }

  // UC-24: Get all bookmarks
  @Get()
  @HttpCode(HttpStatus.OK)
  getBookmarks() {
    return this.bookmarksService.getBookmarks(TEMP_USER_ID);
  }

  // UC-25: Remove a bookmark by careerId
  @Delete(':careerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeBookmark(@Param('careerId', ParseIntPipe) careerId: number) {
    return this.bookmarksService.removeBookmark(TEMP_USER_ID, careerId);
  }
}