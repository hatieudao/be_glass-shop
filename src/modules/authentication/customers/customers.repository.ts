import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './schema/customer.schema';
import { BaseRepository } from '../../../base/base.repository';

@Injectable()
export class CustomersRepository extends BaseRepository<Customer> {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {
    super(customerRepository);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    try {
      const customers = await this.findAll({ where: { email } });
      return customers.length > 0 ? customers[0] : null;
    } catch (error) {
      return null;
    }
  }
}
