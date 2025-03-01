import { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from './../../constant/index';
const accessTokenExpiredTime = 5000000000000000000;
const refreshTokenExpiredTime = 60 * 60 * 24 * 30;

const accessTokenSignConfig = {
  secret: JWT_SECRET_KEY,
  expiresIn: accessTokenExpiredTime,
};
const refreshTokenSignConfig = {
  secret: JWT_REFRESH_SECRET_KEY,
  expiresIn: refreshTokenExpiredTime,
};
export { accessTokenSignConfig, refreshTokenSignConfig };
