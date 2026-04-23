import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn
} from 'typeorm';
import { Career } from './career.entity';

@Entity('career_descriptions')
export class CareerDescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  fullDescription: string;

  @Column('text', { nullable: true })
  dayInTheLife: string;

  @Column('simple-array', { nullable: true })
  workEnvironments: string[];

  @Column('simple-array', { nullable: true })
  relatedCareers: string[];

  @OneToOne(() => Career, (career) => career.description, { onDelete: 'CASCADE' })
  @JoinColumn()
  career: Career;

  @Column()
  careerId: number;
}