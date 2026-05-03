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

const TEMP_USER_ID = 1;

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addBookmark(@Body() dto: CreateBookmarkDto) {
    return this.bookmarksService.addBookmark(TEMP_USER_ID, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getBookmarks() {
    return this.bookmarksService.getBookmarks(TEMP_USER_ID);
  }

  @Delete('reset/all')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetAll() {
    return this.bookmarksService.resetAll();
  }

  @Delete(':careerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeBookmark(@Param('careerId', ParseIntPipe) careerId: number) {
    return this.bookmarksService.removeBookmark(TEMP_USER_ID, careerId);
  }
}