import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'email', type: String })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'password', type: String })
  password: string;

  @IsString()
  @ApiProperty({ description: 'refreshToken', type: String })
  refreshToken: string;
  
  @ApiProperty({ description: 'isActivated', type: Boolean })
  isActivated: boolean;
  
  @IsString()
  @ApiProperty({ description: 'activateCode', type: String })
  activateCode: string;
  @IsString()
  @ApiProperty({ description: 'firstName', type: String })
  firstName: string;
  
  @IsString()
  @ApiProperty({ description: 'lastName', type: String })
  lastName: string;
}
