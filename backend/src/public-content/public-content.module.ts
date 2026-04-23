import { Module } from '@nestjs/common';
import { PublicContentController } from './public-content.controller';

@Module({
  controllers: [PublicContentController],
})
export class PublicContentModule {}