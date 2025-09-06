
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tags: string;

  @Column({ length: 255, nullable: true })
  image_thumb: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp' })
  published_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
