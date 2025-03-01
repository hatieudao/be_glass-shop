import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class Base {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Primary key', type: Number })
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Created date', type: Date })
  created_at: Date;
}
