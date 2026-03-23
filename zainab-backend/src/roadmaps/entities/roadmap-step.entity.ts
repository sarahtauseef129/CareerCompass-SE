import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roadmap } from './roadmap.entity';

@Entity()
export class RoadmapStep {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Roadmap, { onDelete: 'CASCADE' })
  roadmap: Roadmap;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  stepOrder: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
