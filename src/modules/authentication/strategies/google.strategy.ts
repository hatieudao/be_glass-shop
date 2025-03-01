import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } from '../../../constant/index'
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get<string>(GOOGLE_CLIENT_ID),
      clientSecret: config.get<string>(GOOGLE_CLIENT_SECRET),
      callbackURL: config.get<string>(GOOGLE_CALLBACK_URL),
      scope: ['profile', 'email']
    })
  }
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
