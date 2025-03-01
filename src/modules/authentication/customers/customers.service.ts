import { Injectable } from '@nestjs/common';
import { CustomersRepository } from './customers.repository';
import { Customer } from './schema/customer.schema';
import * as bcrypt from 'bcrypt';
import { BaseService } from '../../../base/base.service';

@Injectable()
export class CustomersService extends BaseService<Customer> {
  constructor(private readonly customersRepository: CustomersRepository) {
    super(customersRepository);
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    if (!email) {
      throw new Error(
        'getCustomerByEmail FAILED: Cannot read email value which is required field!',
      );
    }
    return await this.customersRepository.findByEmail(email);
  }

  async validateCustomerPassword(
    email: string,
    password: string,
  ): Promise<Customer | null> {
    if (!email || !password) {
      throw new Error(
        'validateCustomerPassword FAILED: Cannot read email or password value which is required field!',
      );
    }
    const customer = await this.getCustomerByEmail(email);
    if (customer && (await bcrypt.compare(password, customer.passwordHash))) {
      return customer;
    }
    return null;
  }

  async updateCustomerRefreshToken(
    customerId: string,
    refreshToken: string,
  ): Promise<Customer> {
    if (!customerId || !refreshToken) {
      throw new Error(
        'updateCustomerRefreshToken FAILED: Cannot read customerId or refreshToken value which is required field!',
      );
    }
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    return await this.updateOne(customerId, {
      refreshToken: hashedRefreshToken,
    } as any);
  }

  async getCustomerIdByEmail(email: string): Promise<string> {
    const customer = await this.getCustomerByEmail(email);
    if (!customer) {
      throw new Error(
        'getCustomerIdByEmail FAILED: Customer not found with given email!',
      );
    }
    return customer.id.toString();
  }

  async setActivatedCode(
    customerId: string,
    activateCode: string,
  ): Promise<Customer> {
    if (!customerId || !activateCode) {
      throw new Error(
        'setActivatedCode FAILED: Cannot read customerId or activateCode value which is required field!',
      );
    }
    return await this.updateOne(customerId, { activateCode } as any);
  }
}
