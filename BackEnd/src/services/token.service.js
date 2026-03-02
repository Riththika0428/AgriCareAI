import jwt from 'jsonwebtoken';
import config from '../config/dotenv.js';

class TokenService {
  generateTokens(userId, role) {
    const accessToken = jwt.sign(
      { userId, role },
      config.jwtAccessSecret,
      { expiresIn: config.jwtAccessExpiry }
    );

    const refreshToken = jwt.sign(
      { userId, role },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiry }
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.jwtAccessSecret);
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.jwtRefreshSecret);
    } catch (error) {
      return null;
    }
  }
}

export default new TokenService();