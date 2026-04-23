//comparison.module.ts
import { Module } from '@nestjs/common';
import { ComparisonService } from './comparison.service';
import { ComparisonController } from './comparison.controller';
import { CareersModule } from '../careers/careers.module';

@Module({
  imports: [CareersModule], // gives us CareersService via its exports
  controllers: [ComparisonController],
  providers: [ComparisonService],
})
export class ComparisonModule {}