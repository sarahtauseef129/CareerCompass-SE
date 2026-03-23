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
}
