import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareersService } from './careers.service';
import { CareersController } from './careers.controller';
import { Career } from './entities/career.entity';
import { CareerSkill } from './entities/career-skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Career, CareerSkill])],
  controllers: [CareersController],
  providers: [CareersService],
  exports: [CareersService],
})
export class CareersModule {}
