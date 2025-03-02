import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { JwtRefreshAuthGuard } from '../../common/guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Get,
  Body,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { REDIRECTPAGE } from '../../constant';
import { AuthService } from './authentication.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';

interface TokenPayload {
  exp?: number;
  email?: string;
  sub?: string;
}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Protected route that requires JWT authentication' })
  @ApiResponse({ status: 200, description: 'JWT authentication successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getHello(@Request() req): any {
    return 'jwt passed !';
  }

  @Post('local/signin')
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    headers: {
      'access-token': {
        description: 'JWT access token',
        schema: { type: 'string' },
      },
      'refresh-token': {
        description: 'JWT refresh token',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Login failed' })
  async login(@Body() userInfo, @Response() res): Promise<any> {
    const successLoginUser = await this.authservice.login(userInfo);
    if (successLoginUser) {
      res.set({
        'access-token': successLoginUser.access_token,
        'refresh-token': successLoginUser.refresh_token,
      });
      return res.status(200).send(successLoginUser.userInfor);
    }
    return res.status(500).send('Can not register new user');
  }

  @Post('local/signup')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Registration successful',
    headers: {
      'access-token': {
        description: 'JWT access token',
        schema: { type: 'string' },
      },
      'refresh-token': {
        description: 'JWT refresh token',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Registration failed' })
  async signupLocal(@Body() userInfo: any, @Response() res: any): Promise<any> {
    const registedNewUser = await this.authservice.register(userInfo);
    if (registedNewUser) {
      res.set({
        'access-token': registedNewUser.access_token,
        'refresh-token': registedNewUser.refresh_token,
      });
      return res.status(200).send(registedNewUser.userInfor);
    }
    return res.status(500).send('Can not register new user');
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Token refresh successful',
    headers: {
      'access-token': {
        description: 'New JWT access token',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshAccessToken(
    @Response() res: any,
    @Request() req: any,
  ): Promise<any> {
    const refreshToken = this.authservice.getTokenFromRequestHeader(req);
    const payload = this.authservice.tokenToPayload(refreshToken);
    if (!payload.sub) {
      throw new BadRequestException('Invalid token payload');
    }
    const refreshResult = await this.authservice.refreshAccessToken(
      refreshToken,
      payload.sub,
    );
    if (refreshResult) {
      res.set({
        'access-token': refreshResult.access_token,
      });
      return res.status(200).send();
    }
    return res.status(500).send('Can not register new user');
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiHeader({
    name: 'origin',
    description: 'Client-side origin for redirect',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Google login successful, redirects with tokens',
  })
  @ApiResponse({ status: 500, description: 'Google login failed' })
  async googleLogin(
    @Response() res: any,
    @Request() req: any,
    @Headers() header: any,
  ): Promise<any> {
    const clientSide = header.origin;
    const authInfo = await this.authservice.loginWithThirdService(req);
    if (authInfo) {
      res.set({
        'access-token': authInfo.access_token,
        'refresh-token': authInfo.refresh_token,
      });
      return res
        .status(200)
        .redirect(
          `${this.config.get<string>(REDIRECTPAGE)}redirectPage/${authInfo.access_token}/${authInfo.refresh_token}`,
        );
    }
    return res.status(500).send('Can not login with gooogle');
  }

  @Get('sendActivateEmail')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send account activation email' })
  @ApiResponse({
    status: 200,
    description: 'Activation email sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid token payload' })
  async sendActivateEmail(@Request() req: any): Promise<any> {
    const accessToken = this.authservice.getTokenFromRequestHeader(req);
    const payload = this.authservice.tokenToPayload(accessToken);
    if (!payload.email || !payload.sub) {
      throw new BadRequestException('Invalid token payload');
    }
    return await this.authservice.sentActivateAccountEmail({
      email: payload.email,
      sub: payload.sub,
    });
  }

  @Post('sendInviteGroupEmail')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send group invitation email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'invitee@example.com' },
        invitationLink: {
          type: 'string',
          example: 'https://example.com/invite/123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Invitation email sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid token payload' })
  async sendInviteGroupEmail(
    @Request() req: any,
    @Body() body: { email: string; invitationLink: string },
  ): Promise<any> {
    const accessToken = this.authservice.getTokenFromRequestHeader(req);
    const payload = this.authservice.tokenToPayload(accessToken);
    if (!payload.email) {
      throw new BadRequestException('Invalid token payload');
    }
    return await this.authservice.sentInvitationGroupEmail(
      { email: payload.email },
      body.email,
      body.invitationLink,
    );
  }

  @Get('activateAccount')
  @ApiOperation({ summary: 'Activate user account' })
  @ApiQuery({
    name: 'token',
    type: 'string',
    description: 'Account activation token',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Account activated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid activation token' })
  async activateAccount(@Request() req: any, @Query() query): Promise<any> {
    const result = await this.authservice.activateUser(query);
    if (result) {
      return 'Your account has been activated!';
    } else return result;
  }

  @Get('/current-user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'Current user information retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@GetCurrentUserId() userId) {
    return await this.authservice.getCurrentUser(userId);
  }
}
