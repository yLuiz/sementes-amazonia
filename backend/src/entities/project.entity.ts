
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 255, nullable: true })
  image_thumb: string;

  @Column({ type: 'timestamp' })
  created_at: string | Date;

  @Column({ type: 'timestamp' })
  updated_at: string | Date;
}
