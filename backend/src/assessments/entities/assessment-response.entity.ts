import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';

@Entity()
export class AssessmentResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Assessment, { onDelete: 'CASCADE' })
  assessment: Assessment;

  @Column({ type: 'varchar', length: 255 })
  questionKey: string;

  @Column({ type: 'varchar', length: 100 })
  questionType: string;

  @Column({ type: 'float' })
  score: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
