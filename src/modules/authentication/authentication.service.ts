import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { API_SEND_MAIL_KEY, DOMAINNAME } from '../../constant';
import { accessTokenSignConfig, refreshTokenSignConfig } from './tokenConfig';
import { CustomersService } from './customers/customers.service';
import { Customer } from './customers/schema/customer.schema';
import * as sendGrid from '@sendgrid/mail';
import { generate, GenerateOptions } from 'randomstring';

interface TokenPayload {
  exp?: number;
  email?: string;
  sub?: string;
}

const convertToUserInfor = (user: Customer) => ({
  email: user.email,
  firstName: user.name,
  lastName: user.name,
  id: user.id,
  isActivated: user.isActivated,
});

@Injectable()
export class AuthService {
  constructor(
    private customersService: CustomersService,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Customer | null> {
    return await this.customersService.validateCustomerPassword(
      email,
      password,
    );
  }

  async getCurrentUser(id: string) {
    const user = await this.customersService.getItemById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return convertToUserInfor(user);
  }

  async login(user: { email: string; password: string }) {
    const result = await this.customersService.validateCustomerPassword(
      user.email,
      user.password,
    );
    if (result) {
      const thisUser = await this.customersService.getCustomerByEmail(
        user.email,
      );
      if (!thisUser) {
        throw new BadRequestException('User not found');
      }
      const payload = { email: thisUser.email, sub: thisUser.id };
      const refreshToken = (
        await this.customersService.getItemById(thisUser.id)
      )?.refreshToken;

      if (refreshToken) {
        const decodedToken = this.tokenToPayload(refreshToken);
        if (decodedToken?.exp && Date.now() >= decodedToken.exp * 1000) {
          const newRefreshToken = this.jwtService.sign(
            payload,
            refreshTokenSignConfig,
          );
          await this.customersService.updateCustomerRefreshToken(
            thisUser.id,
            newRefreshToken,
          );
        }
      }

      const currentUser = await this.customersService.getCustomerByEmail(
        thisUser.email,
      );
      return {
        access_token: this.jwtService.sign(payload, accessTokenSignConfig),
        refresh_token: currentUser?.refreshToken,
        userInfor: convertToUserInfor(thisUser),
      };
    }
    return null;
  }

  async register(user: {
    email: string;
    password: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<any> {
    const userFindByEmail = await this.customersService.getCustomerByEmail(
      user.email,
    );
    if (userFindByEmail) {
      throw new BadRequestException('Email already exists');
    }
    if (user.confirmPassword && user.confirmPassword !== user.password) {
      throw new BadRequestException(
        'The password and confirm password is not the same',
      );
    }
    const hash = await bcrypt.hash(user.password, 12);
    const createUser = await this.customersService.create({
      email: user.email,
      passwordHash: hash,
      refreshToken: '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      isAdmin: false,
    });
    const userId = await this.customersService.getCustomerIdByEmail(user.email);
    const payload = { email: user.email, sub: userId };
    const newRefreshToken = this.jwtService.sign(
      payload,
      refreshTokenSignConfig,
    );
    await this.customersService.updateCustomerRefreshToken(
      userId,
      newRefreshToken,
    );
    if (createUser) {
      return {
        access_token: this.jwtService.sign(payload, accessTokenSignConfig),
        refresh_token: newRefreshToken,
      };
    }
    return null;
  }

  async refreshAccessToken(refreshToken: string, userId: string): Promise<any> {
    const user = await this.customersService.getItemById(userId);
    if (!user) {
      throw new BadRequestException('Can not get user with given userId');
    }
    if (refreshToken === user.refreshToken) {
      const payload = { email: user.email, sub: userId };
      const newAccessToken = this.jwtService.sign(
        payload,
        accessTokenSignConfig,
      );
      return {
        access_token: newAccessToken,
      };
    }
    return null;
  }

  async loginWithThirdService(req: { user: { email: string } }): Promise<any> {
    if (!req.user) {
      throw new BadRequestException(
        'Can not read user from request which is required field',
      );
    }
    const existedUser = await this.customersService.getCustomerByEmail(
      req.user.email,
    );
    if (!existedUser) {
      const hash = await bcrypt.hash('123456', 12);
      const createUser = await this.customersService.create({
        email: req.user.email,
        passwordHash: hash,
        refreshToken: '',
        name: '',
        isAdmin: false,
      });
      const userId = await this.customersService.getCustomerIdByEmail(
        req.user.email,
      );
      const payload = { email: req.user.email, sub: userId };
      const newRefreshToken = this.jwtService.sign(
        payload,
        refreshTokenSignConfig,
      );
      await this.customersService.updateCustomerRefreshToken(
        userId,
        newRefreshToken,
      );
      if (createUser) {
        return {
          access_token: this.jwtService.sign(payload, accessTokenSignConfig),
          refresh_token: newRefreshToken,
        };
      }
      return null;
    }
    const currentRefreshToken = existedUser.refreshToken;
    if (currentRefreshToken) {
      const decodedToken = this.tokenToPayload(currentRefreshToken);
      const userId = await this.customersService.getCustomerIdByEmail(
        req.user.email,
      );
      const payload = { sub: userId, email: req.user.email };

      if (decodedToken?.exp && Date.now() >= decodedToken.exp * 1000) {
        const newRefreshToken = this.jwtService.sign(
          payload,
          refreshTokenSignConfig,
        );
        await this.customersService.updateCustomerRefreshToken(
          userId,
          newRefreshToken,
        );
      }

      const currentUser = await this.customersService.getCustomerByEmail(
        req.user.email,
      );
      return {
        access_token: this.jwtService.sign(payload, accessTokenSignConfig),
        refresh_token: currentUser?.refreshToken,
      };
    }
    return null;
  }

  async sentActivateAccountEmail(userInfo: {
    email: string;
    sub: string;
  }): Promise<void> {
    const email = userInfo.email;
    const options: GenerateOptions = {
      length: 32,
      charset: 'alphanumeric',
    };
    const activateCode = generate(options);
    const setResult = await this.customersService.setActivatedCode(
      userInfo.sub,
      activateCode,
    );
    const domainName = this.config.get<string>(DOMAINNAME);
    const senderApiKey = this.config.get<string>(API_SEND_MAIL_KEY);

    if (!senderApiKey) {
      throw new Error('SendGrid API key not configured');
    }

    if (setResult) {
      sendGrid.setApiKey(senderApiKey);
      const message = {
        to: email,
        from: 'darkflamekhtn@gmail.com',
        subject: 'Activate your account now!',
        html: `${domainName}api/auth/activateAccount?userId=${userInfo.sub}&activateCode=${activateCode}`,
      };
      await sendGrid.send(message);
    } else {
      throw new Error('Failed to set activate code to user');
    }
  }

  async sentInvitationGroupEmail(
    userInfo: { email: string },
    email: string,
    invitationLink: string,
  ): Promise<void> {
    const senderApiKey = this.config.get<string>(API_SEND_MAIL_KEY);
    if (!senderApiKey) {
      throw new Error('SendGrid API key not configured');
    }

    try {
      sendGrid.setApiKey(senderApiKey);
      const message = {
        to: email,
        from: 'darkflamekhtn@gmail.com',
        subject: `${userInfo.email} invited you to join a group`,
        html: `${invitationLink}`,
      };
      await sendGrid.send(message);
    } catch {
      throw new Error('Failed to send invitation email');
    }
  }

  async activateUser(query: {
    userId: string;
    activateCode: string;
  }): Promise<boolean> {
    if (!query.userId || !query.activateCode) {
      throw new BadRequestException(
        'Cannot read userId or activateCode from query params which is required field',
      );
    }
    const userFindById = await this.customersService.getItemById(query.userId);
    if (!userFindById) {
      throw new BadRequestException(
        'Cannot find user with given userId taken from query params',
      );
    }
    if (userFindById.activateCode !== query.activateCode) {
      return false;
    }
    await this.customersService.updateOne(query.userId, { isActivated: true });
    return true;
  }

  getTokenFromRequestHeader(request: {
    headers: { authorization: string };
  }): string {
    const requestAuthorization = request.headers.authorization;
    const [, token] = requestAuthorization.split(' ');
    return token;
  }

  tokenToPayload(token: string): TokenPayload {
    return this.jwtService.decode(token) as TokenPayload;
  }
}
