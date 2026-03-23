import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Career } from '../../careers/entities/career.entity';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Career, { onDelete: 'CASCADE' })
  career: Career;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
