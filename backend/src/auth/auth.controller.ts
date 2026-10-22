import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password?: string }) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: { email: string; role: any; firstName: string; lastName: string }) {
    return this.authService.register(body);
  }

  @Post('refresh')
  async refresh() {
    return {
      success: true,
      data: {
        accessToken: `jwt_refreshed_${Date.now()}`,
        expiresIn: 3600,
      },
    };
  }

  @Post('logout')
  async logout() {
    return { success: true };
  }

  @Get('me')
  async getProfile() {
    return this.authService.getProfile();
  }
}
