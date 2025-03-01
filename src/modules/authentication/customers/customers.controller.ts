import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './schema/customer.schema';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() customerData: Partial<Customer>): Promise<Customer> {
    return await this.customersService.create(customerData);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer> {
    const customer = await this.customersService.getItemById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() customerData: Partial<Customer>,
  ): Promise<Customer> {
    return await this.customersService.updateOne(id, customerData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.customersService.delete(id);
  }
}
