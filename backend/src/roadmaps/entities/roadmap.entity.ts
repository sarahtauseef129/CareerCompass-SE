import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Career } from '../../careers/entities/career.entity';
import { RoadmapStep } from './roadmap-step.entity';  // 👈 add import

@Entity()
export class Roadmap {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Career, { onDelete: 'CASCADE' })
  career: Career;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => RoadmapStep, (step) => step.roadmap, { // 👈 add this
    eager: false,
    cascade: true,
  })
  steps: RoadmapStep[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}