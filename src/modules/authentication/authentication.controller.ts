import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { JwtRefreshAuthGuard } from '../../common/guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Controller, Post, UseGuards, Request, Response, Get, Body, Query, Headers } from '@nestjs/common';
import { REDIRECTPAGE } from '../../constant';
import { AuthService } from './authentication.service';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { ApiTags } from '@nestjs/swagger';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService,
    private readonly config: ConfigService) {
  }
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req): any {
    return 'jwt passed !'
  }

  @Post('local/signin')
  async login(@Body() userInfo, @Response() res): Promise<any> {
    const successLoginUser = await this.authservice.login(userInfo);
    if (successLoginUser) {
      res.set({
        'access-token': successLoginUser.access_token,
        'refresh-token': successLoginUser.refresh_token
      })
      return res.status(200).send(
        successLoginUser.userInfor
      );
    }
    return res.status(500).send("Can not register new user")
  }

  @Post('local/signup')
  async signupLocal(@Body() userInfo: any, @Response() res: any): Promise<any> {
    const registedNewUser = await this.authservice.register(userInfo);
    if (registedNewUser) {
      res.set({
        'access-token': registedNewUser.access_token,
        'refresh-token': registedNewUser.refresh_token,
      })
      return res.status(200).send(
        registedNewUser.userInfor
      );
    }
    return res.status(500).send("Can not register new user")
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refreshAccessToken(@Response() res: any, @Request() req: any): Promise<any> {
    const refreshToken = this.authservice.getTokenFromRequestHeader(req);
    const payload = this.authservice.tokenToPayload(refreshToken);
    const refreshResult = await this.authservice.refreshAccessToken(refreshToken, payload.sub)
    if (refreshResult) {
      res.set({
        'access-token': refreshResult.access_token,
      })
      return res.status(200).send();
    }
    return res.status(500).send("Can not register new user")
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Response() res: any, @Request() req: any, @Headers() header: any): Promise<any> {
    const clientSide = header.origin;
    const authInfo = await this.authservice.loginWithThirdService(req);
    if (authInfo) {
      res.set({
        'access-token': authInfo.access_token,
        'refresh-token': authInfo.refresh_token
      })
      return res.status(200).redirect(`${this.config.get<string>(REDIRECTPAGE)}redirectPage/${authInfo.access_token}/${authInfo.refresh_token}`)
    }
    return res.status(500).send("Can not login with gooogle")
  }

  @Get('sendActivateEmail')
  @UseGuards(JwtAuthGuard)
  async sendActivateEmail(@Request() req: any): Promise<any> {
    const accessToken = this.authservice.getTokenFromRequestHeader(req);
    const payload = this.authservice.tokenToPayload(accessToken);
    return await this.authservice.sentActivateAccountEmail(payload);
  }

  @Post('sendInviteGroupEmail')
  @UseGuards(JwtAuthGuard)
  async sendInviteGroupEmail(@Request() req: any): Promise<any> {
    const accessToken = this.authservice.getTokenFromRequestHeader(req);
    const payload = this.authservice.tokenToPayload(accessToken);
    const { email, invitationLink } = req.body;
    return await this.authservice.sentInvitationGroupEmail(payload, email, invitationLink);
  }

  @Get('activateAccount')
  async activateAccount(@Request() req: any, @Query() query): Promise<any> {
    const result = await this.authservice.activateUser(query);
    if (result) {
      return "Your account has been activated!";
    }
    else return result;
  }
  @Get('/current-user')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@GetCurrentUserId() userId) {
    return await this.authservice.getCurrentUser(userId);
  }
}
