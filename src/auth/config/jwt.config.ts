import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default_secret',
  audience: process.env.JWT_TOKEN_AUDIENCE || 'http://localhost',
  issuer: process.env.JWT_TOKEN_ISSUER || 'nest-api',
  accessTokenTTL: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600', 10),
  refreshTokenTTL: parseInt(process.env.JWT_REFRESH_TOKEN_TTL ?? '86400', 10),
  refreshSecret: process.env.JWT_REFRESH_SECRET ,
  emailTokenTTL: parseInt(process.env.JWT_EMAIL_TOKEN_TTL ?? '3600', 10),
}));
