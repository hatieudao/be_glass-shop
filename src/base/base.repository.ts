import {
  Logger,
  Injectable,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';
import { BaseSchema } from './base.schema';

@Injectable()
export class BaseRepository<T extends BaseSchema> {
  private logger = new Logger(this.constructor.name);

  constructor(private readonly repository: Repository<T>) {}

  async create(item: DeepPartial<T>): Promise<T> {
    try {
      const newItem = this.repository.create(item);
      const savedItem = await this.repository.save(newItem);
      return savedItem;
    } catch (error: unknown) {
      this.logger.error(error);
      throw new BadGatewayException(
        error instanceof Error ? error.message : 'Error creating item',
      );
    }
  }

  async updateOne(id: string, item: DeepPartial<T>): Promise<T> {
    try {
      await this.repository.update(id, item as any);
      const updated = await this.findById(id);
      if (!updated) {
        throw new NotFoundException(`Item with id ${id} not found`);
      }
      return updated;
    } catch (error: unknown) {
      this.logger.error(error);
      throw new BadGatewayException(
        error instanceof Error ? error.message : 'Error updating item',
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.repository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Item with id ${id} not found`);
      }
      return {
        message: 'Item with id: ' + id + ' deleted',
      };
    } catch (error: unknown) {
      this.logger.error(error);
      throw new BadGatewayException(
        error instanceof Error ? error.message : 'Error deleting item',
      );
    }
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repository.find(options);
    } catch (error: unknown) {
      this.logger.error(error);
      throw new BadGatewayException(
        error instanceof Error ? error.message : 'Error finding items',
      );
    }
  }

  async findById(id: string): Promise<T> {
    try {
      const item = await this.repository.findOne({
        where: { id: id } as unknown as FindOptionsWhere<T>,
      });
      if (!item) {
        throw new NotFoundException(`Item with id ${id} not found`);
      }
      return item;
    } catch (error: unknown) {
      this.logger.error(error);
      throw new BadGatewayException(
        error instanceof Error ? error.message : 'Error finding item',
      );
    }
  }
}
