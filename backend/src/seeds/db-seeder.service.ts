// src/seeds/db-seeder.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Career } from '../careers/entities/career.entity';
import { CareerSkill } from '../careers/entities/career-skill.entity';
import { User } from '../users/entities/user.entity';
import { CAREERS_SEED_DATA } from './careers-seed.data';
import { USERS_SEED_DATA } from './users-seed.data';

import { Roadmap } from '../roadmaps/entities/roadmap.entity';
import { RoadmapStep } from '../roadmaps/entities/roadmap-step.entity';
import { ROADMAP_SEED_DATA } from './roadmap-seed.data';

@Injectable()
export class DbSeederService {
  constructor(
    @InjectRepository(Career)
    private careerRepository: Repository<Career>,
    @InjectRepository(CareerSkill)
    private careerSkillRepository: Repository<CareerSkill>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Roadmap)
    private roadmapRepository: Repository<Roadmap>,
    @InjectRepository(RoadmapStep)
    private roadmapStepRepository: Repository<RoadmapStep>,
  ) {}

  async seedCareers() {
    console.log('Starting careers seeding...');

    // Check if data already exists
    const existingCount = await this.careerRepository.count();
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} careers. Skipping seed.`);
      return {
        message: 'Database already seeded',
        careersCount: existingCount,
      };
    }

    try {
      for (const careerData of CAREERS_SEED_DATA) {
        // Create career entity
        const career = this.careerRepository.create({
          title: careerData.title,
          description: careerData.description,
          educationPath: careerData.educationPath,
          industryOverview: careerData.industryOverview,
        });

        // Save career first
        const savedCareer = await this.careerRepository.save(career);

        // Create and save associated skills
        if (careerData.skills && careerData.skills.length > 0) {
          const skills = careerData.skills.map((skill) =>
            this.careerSkillRepository.create({
              skillName: skill.skillName,
              importanceLevel: skill.importanceLevel,
              career: savedCareer,
            }),
          );

          await this.careerSkillRepository.save(skills);
        }

        console.log(`✓ Seeded career: ${careerData.title}`);
      }

      const finalCount = await this.careerRepository.count();
      console.log(
        `\n✓ Careers seeding completed successfully! Total careers: ${finalCount}`,
      );

      return {
        message: 'Careers seeded successfully',
        careersCount: finalCount,
      };
    } catch (error) {
      console.error('Error seeding careers:', error);
      throw error;
    }
  }

  async resetCareers() {
    console.log('Resetting careers data...');

    try {
      // Delete all career skills first (foreign key constraint)
      await this.careerSkillRepository.delete({});
      console.log('✓ Deleted all career skills');

      // Delete all careers
      await this.careerRepository.delete({});
      console.log('✓ Deleted all careers');

      return { message: 'All careers and skills deleted successfully' };
    } catch (error) {
      console.error('Error resetting careers:', error);
      throw error;
    }
  }

  async reseedCareers() {
    console.log('Reseeding careers (removing old data first)...');
    await this.resetCareers();
    return this.seedCareers();
  }

  async seedUsers() {
    console.log('Starting users seeding...');

    try {
      const createdUsers: User[] = [];
      for (const userData of USERS_SEED_DATA) {
        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
          where: { email: userData.email },
        });

        if (existingUser) {
          console.log(`⊘ User already exists: ${userData.email}`);
          createdUsers.push(existingUser);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Create user
        const user = this.userRepository.create({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        });

        const savedUser = await this.userRepository.save(user);
        createdUsers.push(savedUser);
        console.log(`✓ Seeded user: ${userData.email}`);
      }

      console.log(`\n✓ Users seeding completed! Total users: ${createdUsers.length}`);

      // Return users without password field
      const usersWithoutPasswords = createdUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }));

      return {
        message: 'Users seeded successfully',
        usersCount: createdUsers.length,
        users: usersWithoutPasswords,
      };
    } catch (error) {
      console.error('Error seeding users:', error);
      throw error;
    }
  }

  async resetUsers() {
    console.log('Resetting users data...');

    try {
      // Delete all users
      await this.userRepository.delete({});
      console.log('✓ Deleted all users');

      return { message: 'All users deleted successfully' };
    } catch (error) {
      console.error('Error resetting users:', error);
      throw error;
    }
  }
async seedAll() {
  console.log('Seeding all data...');
  const careerResult = await this.seedCareers();
  const userResult = await this.seedUsers();
  const roadmapResult = await this.seedRoadmaps(); // 👈 this line was missing

  return {
    message: 'All data seeded successfully',
    careers: careerResult,
    users: userResult,
    roadmaps: roadmapResult,
  };
}

  async seedRoadmaps() {
  console.log('Starting roadmaps seeding...');

  const existingCount = await this.roadmapRepository.count();
  if (existingCount > 0) {
    console.log(`Database already contains ${existingCount} roadmaps. Skipping.`);
    return { message: 'Roadmaps already seeded', roadmapsCount: existingCount };
  }

  try {
    for (const roadmapData of ROADMAP_SEED_DATA) {
      // find matching career by title
      const career = await this.careerRepository.findOne({
        where: { title: roadmapData.careerTitle },
      });

      if (!career) {
        console.log(`⚠ Career not found: ${roadmapData.careerTitle}, skipping.`);
        continue;
      }

      const roadmap = this.roadmapRepository.create({
        career,
        title: roadmapData.title,
        description: roadmapData.description,
      });

      const savedRoadmap = await this.roadmapRepository.save(roadmap);

      const steps = roadmapData.steps.map((step) =>
        this.roadmapStepRepository.create({
          roadmap: savedRoadmap,
          title: step.title,
          description: step.description,
          stepOrder: step.stepOrder,
        }),
      );

      await this.roadmapStepRepository.save(steps);
      console.log(`✓ Seeded roadmap: ${roadmapData.title}`);
    }

    const finalCount = await this.roadmapRepository.count();
    console.log(`\n✓ Roadmaps seeding completed! Total: ${finalCount}`);
    return { message: 'Roadmaps seeded successfully', roadmapsCount: finalCount };

  } catch (error) {
    console.error('Error seeding roadmaps:', error);
    throw error;
  }
}

async resetRoadmaps() {
  await this.roadmapStepRepository.delete({});
  await this.roadmapRepository.delete({});
  console.log('✓ Deleted all roadmaps and steps');
  return { message: 'All roadmaps deleted successfully' };
}
}
