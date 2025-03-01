import {
  Type,
  UsePipes,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AbstractValidationPipe } from './abstract-validation.pipe';
import { IBaseController } from './ibase.controller';
import { IBaseService } from './IBase.service';

export function FactoryBaseController<T, C, U>(
  createDto: Type<C>,
  updateDto: Type<U>,
): Type<IBaseController<T, C, U>> {
  const createPipe = new AbstractValidationPipe(
    { /* whitelist: true, */ transform: true /* forbidNonWhitelisted: true */ },
    { body: createDto },
  );
  const updatePipe = new AbstractValidationPipe(
    { /* whitelist: true, */ transform: true },
    { body: updateDto },
  );

  class CRUD<T, C, U> implements IBaseController<T, C, U> {
    constructor(protected readonly iBaseService: IBaseService<T>) { }
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
    @UsePipes(createPipe)
    @ApiBody({ type: createDto })
    @ApiResponse({
      status: 201,
      description: 'The record has been successfully created.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(@Body() entity: C): Promise<T> {
      return await this.iBaseService.create(entity);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Model deleted successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async delete(@Param('id') id: string) {
      return await this.iBaseService.delete(id);
    }

    @Put()
    @UsePipes(updatePipe)
    @ApiBody({ type: updateDto })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 200, description: 'Model update successfully.' })
    async update(id: string, @Body() entity: U): Promise<T> {
      return await this.iBaseService.updateOne(id, entity);
    }
  }
  return CRUD;
}
