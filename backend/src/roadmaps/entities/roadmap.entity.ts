import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Career } from '../../careers/entities/career.entity';

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

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
