
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
