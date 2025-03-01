import { BaseUpdateDto } from './dto/base-update.dto';
import { BaseCreateDto } from './dto/base-create.dto';
import { BaseDocument } from './base.schema';
import {
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Controller,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { IBaseService } from './IBase.service';
import { IBaseController } from './ibase.controller';

@Controller()
export class BaseController<
  T extends BaseDocument,
  BaseCreateDto,
  BaseUpdateDto,
> implements IBaseController<T, BaseCreateDto, BaseUpdateDto>
{
  constructor(private readonly iBaseService: IBaseService<T>) { }

  @Get()
  @ApiResponse({ status: 200, description: 'Ok' })
  async findAll(filter): Promise<T[]> {
    return await this.iBaseService.getAll(filter);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Model retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Model does not exist' })
  async findById(@Param('id') id: string): Promise<T> {
    return await this.iBaseService.getItemById(id);
  }

  @Post()
  @ApiBody({ type: BaseCreateDto })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() entity: BaseCreateDto, option?: any): Promise<T> {
    return await this.iBaseService.create(entity);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Model deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async delete(@Param('id') id: string) {
    return await this.iBaseService.delete(id);
  }

  @Put(':id')
  @ApiBody({ type: BaseUpdateDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 200, description: 'Model update successfully.' })
  async update(
    @Param('id') id: string,
    @Body() entity: BaseUpdateDto,
  ): Promise<T> {
    console.log('update', id, entity);
    return await this.iBaseService.updateOne(id, entity);
  }
}
