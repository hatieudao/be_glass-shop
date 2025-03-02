import { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from '../../constant/index';
import { ConfigService } from '@nestjs/config';

// Default values if not provided in environment variables
// 1 hour for access token (in seconds)
const DEFAULT_ACCESS_TOKEN_EXPIRY = 5;
// 30 days for refresh token (in seconds)
const DEFAULT_REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 30;

// Create a function that takes ConfigService as an argument
export const getJwtConfig = (configService: ConfigService) => {
  const accessTokenExpiredTime =
    configService.get<number>('JWT_ACCESS_TOKEN_EXPIRY') ||
    DEFAULT_ACCESS_TOKEN_EXPIRY;
  const refreshTokenExpiredTime =
    configService.get<number>('JWT_REFRESH_TOKEN_EXPIRY') ||
    DEFAULT_REFRESH_TOKEN_EXPIRY;

  const accessTokenSignConfig = {
    secret: configService.get<string>(JWT_SECRET_KEY),
    expiresIn: accessTokenExpiredTime,
  };

  const refreshTokenSignConfig = {
    secret: configService.get<string>(JWT_REFRESH_SECRET_KEY),
    expiresIn: refreshTokenExpiredTime,
  };

  return { accessTokenSignConfig, refreshTokenSignConfig };
};
