//career-skill.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Career } from './career.entity';

@Entity()
export class CareerSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  skillName: string;

  @Column({ type: 'smallint' })
  importanceLevel: number;

  @Column({ type: 'integer', nullable: false })
  careerId: number;

  @ManyToOne(() => Career, (career) => career.skills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'careerId' })
  career: Career;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
