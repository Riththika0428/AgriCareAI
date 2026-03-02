import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import config from '../config/dotenv.js';

class GoogleService {
  constructor() {
    this.client = new OAuth2Client(
      config.googleClientId,
      config.googleClientSecret,
      config.googleCallbackUrl
    );
  }

  // Generate Google OAuth URL
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      include_granted_scopes: true
    });
  }

  // Get tokens from code
  async getTokensFromCode(code) {
    try {
      const { tokens } = await this.client.getToken(code);
      return tokens;
    } catch (error) {
      console.error('Error getting tokens from code:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }

  // Get user info from access token
  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw new Error('Failed to get user info from Google');
    }
  }

  // Verify ID token
  async verifyIdToken(idToken) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: config.googleClientId
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw new Error('Invalid ID token');
    }
  }

  // Mobile/SPA token verification
  async verifyMobileToken(idToken) {
    try {
      const payload = await this.verifyIdToken(idToken);
      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        emailVerified: payload.email_verified
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new GoogleService();