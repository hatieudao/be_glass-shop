import { User, UserDocument } from './schema/users.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseRepository } from '../../../base/base.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
  async findUserByEmail(email: String): Promise<any> {
    try {
      return await this.userModel.findOne({ email: email });
    } catch (error) {
      throw new Error(error);
    }
  }
  async validateUserByEmailAndPassword(
    email: String,
    password: String,
  ): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email: email });
      if (!user) {
        throw new BadRequestException(
          'The user with given email does not exist',
        );
      }
      const result = await bcrypt.compare(password, user.password);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUserIdByEmail(email: String): Promise<any> {
    return (await this.userModel.findOne({ email }))._id;
  }
  async updateRefreshTokenByUserId(
    userId: String,
    refreshToken: String,
  ): Promise<any> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new BadRequestException('The user with given id does not exist');
      }
      return await this.userModel.findByIdAndUpdate(userId, { refreshToken });
    } catch (error) {
      throw new Error(error);
    }
  }
  async setUserActivateCode(userId: String, activateCode: String): Promise<any> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new BadRequestException('The user with given id does not exist');
      }
      return await this.userModel.findByIdAndUpdate(userId, { activateCode });
    } catch (error) {
      throw new Error(error);
    }
  }
  async setUserActivatedStatus(userId: String, status: Boolean): Promise<any> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new BadRequestException('The user with given id does not exist');
      }
      return await this.userModel.findByIdAndUpdate(userId, { isActivated: status });
    } catch (error) {
      throw new Error(error);
    }
  }
}
