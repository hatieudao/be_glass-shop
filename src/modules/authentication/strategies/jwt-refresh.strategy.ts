import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_REFRESH_SECRET_KEY } from '../../../constant/index';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_REFRESH_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      name: payload.lastName,
    };
  }
}
