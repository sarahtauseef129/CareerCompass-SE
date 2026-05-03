// src/seeds/db-seeder.controller.ts
import { Controller, Post } from '@nestjs/common';
import { DbSeederService } from './db-seeder.service';

@Controller('seed')
export class DbSeederController {
  constructor(private seederService: DbSeederService) {}

  @Post('careers')
  async seedCareers() {
    return this.seederService.seedCareers();
  }

  @Post('careers/reset')
  async resetCareers() {
    return this.seederService.resetCareers();
  }

  @Post('careers/reseed')
  async reseedCareers() {
    return this.seederService.reseedCareers();
  }

  @Post('users')
  async seedUsers() {
    return this.seederService.seedUsers();
  }

  @Post('users/reset')
  async resetUsers() {
    return this.seederService.resetUsers();
  }

  @Post('all')
  async seedAll() {
    return this.seederService.seedAll();
  }
  @Post('roadmaps')
  async seedRoadmaps() {
    return this.seederService.seedRoadmaps();
  }

  @Post('roadmaps/reset')
  async resetRoadmaps() {
    return this.seederService.resetRoadmaps();
  }
  
  @Post('roadmaps/reseed')
async reseedRoadmaps() {
  return this.seederService.reseedRoadmaps();
}
}
