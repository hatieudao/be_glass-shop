const accessTokenLife = 60 * 60 * 24 * 30 * 1000; // 30 days
const refreshTokenLife = 60 * 60 * 24 * 30 * 12 * 1000; // 12 months

const cookieAccessTokenConfig = {
  maxAge: accessTokenLife,
  httpOnly: true,
  sameSite: 'None',
  secure: true,
};
const cookieRefreshTokenConfig = {
  maxAge: refreshTokenLife,
  httpOnly: true,
  sameSite: 'None',
  secure: true,
};
export { cookieAccessTokenConfig, cookieRefreshTokenConfig };
