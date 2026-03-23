import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CareerSkill } from './career-skill.entity';

@Entity()
export class Career {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  educationPath?: string;

  @Column({ type: 'text', nullable: true })
  industryOverview?: string;

  @OneToMany(() => CareerSkill, (skill) => skill.career, {
    eager: false,
    cascade: true,
  })
  skills?: CareerSkill[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
