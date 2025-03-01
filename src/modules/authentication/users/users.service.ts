import { BaseService } from '../../../base/base.service';
import { UserDocument } from './schema/users.schema';
import { UsersRepository } from './users.repository';
import { Delete, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService extends BaseService<UserDocument> {
  constructor(private readonly usersRepository: UsersRepository) {
    super(usersRepository);
  }
  async getUserByEmail(email: string): Promise<any> {
    if (!email) {
      throw Error(
        'getUserByEmail FAILED: Can not read email value which is required field!',
      );
    }
    try {
      return await this.usersRepository.findUserByEmail(email);
    } catch (error) {
      throw Error(
        'getUserByEmail FAILED: The userModel fail to find user with given email!',
      );
    }
  }
  async validateUserPassword(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw Error(
        'validateUserPassword FAILED: Can not read email or password value which is required field!',
      );
    }
    try {
      const user = await this.usersRepository.validateUserByEmailAndPassword(
        email,
        password,
      );
      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      throw Error(
        'validateUserPassword FAILED: The userModel fail to validate user with given email!',
      );
    }
  }
  async updateUserRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<any> {
    if (!userId || !refreshToken) {
      throw Error(
        'updateUserRefreshToken FAILED: Can not read userId or refreshToken value which is required field!',
      );
    }
    try {
      return await this.usersRepository.updateRefreshTokenByUserId(
        userId,
        refreshToken,
      );
    } catch (error) {
      throw Error(
        "updateUserRefreshToken FAILED: The userModel fail to update user's refreshToken with given userId!",
      );
    }
  }
  async getUserIdByEmail(email: string): Promise<any> {
    return await this.usersRepository.getUserIdByEmail(email);
  }
  async setActivatedCode(userId: string, activateCode: string): Promise<any> {
    if (!userId || !activateCode) {
      throw Error(
        'setActivatedCode FAILED: Can not read userId or activateCode value which is required field!',
      );
    }
    try {
      return await this.usersRepository.setUserActivateCode(
        userId,
        activateCode,
      );
    } catch (error) {
      throw Error(
        "setActivatedCode FAILED: The userModel fail to update user's activateCode with given userId!",
      );
    }
  }
  async updateActivateStatus(userId: string, status: boolean): Promise<any> {
    if (!userId || !status) {
      throw Error(
        'updateActivateStatus FAILED: Can not read userId or activate status value which is required field!',
      );
    }
    try {
      return await this.usersRepository.setUserActivatedStatus(
        userId,
        status,
      );
    } catch (error) {
      throw Error(
        "updateActivateStatus FAILED: The userModel fail to set user's activate status with given userId!",
      );
    }
  }
}
