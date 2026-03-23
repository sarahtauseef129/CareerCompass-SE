import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career } from '../careers/entities/career.entity';
import { CareerSkill } from '../careers/entities/career-skill.entity';
import { User } from '../users/entities/user.entity';
import { DbSeederService } from './db-seeder.service';
import { DbSeederController } from './db-seeder.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Career, CareerSkill, User])],
  providers: [DbSeederService],
  controllers: [DbSeederController],
  exports: [DbSeederService],
})
export class DbSeederModule {}
