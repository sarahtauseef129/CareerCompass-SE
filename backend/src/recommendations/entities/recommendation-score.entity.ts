import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Career } from '../../careers/entities/career.entity';

@Entity()
export class RecommendationScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  userId: number;

  @Column({ type: 'integer', nullable: false })
  careerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Career, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'careerId' })
  career: Career;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'float' })
  interestScore: number;

  @Column({ type: 'float' })
  skillScore: number;

  @Column({ type: 'float' })
  environmentScore: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
