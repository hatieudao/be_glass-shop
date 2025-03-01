import { JwtAuthGuard } from './../../../common/guards/jwt-auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FactoryBaseController } from 'src/base/factory-base.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schema/users.schema';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtAuthGuard)
export class UsersController extends FactoryBaseController<
  UserDocument,
  CreateUserDto,
  UpdateUserDto
>(CreateUserDto, UpdateUserDto) {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }
}
