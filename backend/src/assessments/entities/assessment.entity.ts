import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Assessment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Assessment responses as JSON
  @Column({ type: 'jsonb', nullable: true })
  responses: Record<string, any>;

  // Calculated scores
  @Column({ type: 'float', nullable: true })
  interestScore: number;

  @Column({ type: 'float', nullable: true })
  skillScore: number;

  @Column({ type: 'float', nullable: true })
  environmentScore: number;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
