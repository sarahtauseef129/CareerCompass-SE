import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RoadmapStep } from './roadmap-step.entity';

@Entity()
export class RoadmapProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => RoadmapStep, { onDelete: 'CASCADE' })
  roadmapStep: RoadmapStep;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;;

  @Column({ type: 'integer', default: 0 }) // 👈 added for UC-21
  priorityOrder: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}