import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type BaseDocument = Base & Document & { _id: string };
@Schema()
export class Base {
  @Prop()
  @ApiProperty({ description: 'Created day', type: String, default: Date.now })
  createdAt: Date;

  @Prop()
  @ApiProperty({ description: 'Updated day', type: String, default: null })
  updatedAt: Date;

  @Prop()
  @ApiProperty({ description: 'Deleted day', type: String, default: null })
  deletedAt: Date;
}
export const BaseSchema = SchemaFactory.createForClass(Base);
