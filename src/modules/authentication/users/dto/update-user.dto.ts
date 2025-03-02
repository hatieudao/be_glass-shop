import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty({ description: 'email', type: String })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'password for hashing', type: String })
  password?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'name', type: String })
  name?: string;

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
