
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  titulo: string;

  @Column({ type: 'text' })
  resumo: string;

  @Column({ type: 'date' })
  dataPublicacao: Date;

  @Column({ type: 'text', nullable: true })
  tags: string;

  @Column({ length: 255, nullable: true })
  imagemThumb: string;

  @Column({ type: 'text' })
  conteudoCompleto: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
