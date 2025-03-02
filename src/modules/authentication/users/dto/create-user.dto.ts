import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'email', type: String })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'password for hashing', type: String })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'name', type: String })
  name: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'isAdmin flag', type: Boolean, default: false })
  isAdmin?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'refreshToken', type: String, required: false })
  refreshToken?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'isActivated', type: Boolean, default: false })
  isActivated?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'activateCode', type: String, required: false })
  activateCode?: string;
}
