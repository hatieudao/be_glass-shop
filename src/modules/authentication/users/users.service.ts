import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { BaseService } from '../../../base/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(private readonly usersRepository: UsersRepository) {
    super(usersRepository);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new Error(
        'getUserByEmail FAILED: Cannot read email value which is required field!',
      );
    }
    return await this.usersRepository.findByEmail(email);
  }

  async validateUserPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    if (!email || !password) {
      throw new Error(
        'validateUserPassword FAILED: Cannot read email or password value which is required field!',
      );
    }
    const user = await this.getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async updateUserRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    if (!userId || !refreshToken) {
      throw new Error(
        'updateUserRefreshToken FAILED: Cannot read userId or refreshToken value which is required field!',
      );
    }
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    return await this.updateOne(userId, {
      refreshToken: hashedRefreshToken,
    } as any);
  }

  async getUserIdByEmail(email: string): Promise<string> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error(
        'getUserIdByEmail FAILED: User not found with given email!',
      );
    }
    return user.id.toString();
  }

  async setActivatedCode(userId: string, activateCode: string): Promise<User> {
    if (!userId || !activateCode) {
      throw new Error(
        'setActivatedCode FAILED: Cannot read userId or activateCode value which is required field!',
      );
    }
    return await this.updateOne(userId, { activateCode } as any);
  }
}
