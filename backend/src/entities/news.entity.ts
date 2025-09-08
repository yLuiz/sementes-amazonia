
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tags: string;

  @Column({ length: 255, nullable: true })
  image_thumb: string;

  @Column({ length: 100, nullable: true })
  author: string;

  @Column({ type: 'timestamp' })
  published_at: string | Date;

  @Column({ type: 'timestamp' })
  created_at: string | Date;

  @Column({ type: 'timestamp' })
  updated_at: string | Date;
}
