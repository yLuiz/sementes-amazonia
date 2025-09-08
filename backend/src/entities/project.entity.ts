
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

  @Column({ length: 100, nullable: true })
  author: string;
  
  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

  @Column({ type: 'timestamp', nullable: true })
  published_at: string | Date;

  @Column({ type: 'timestamp' })
  created_at: string | Date;

  @Column({ type: 'timestamp' })
  updated_at: string | Date;
}
