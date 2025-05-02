import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auths.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('logout')
  async logout(@Req() request: Request) {
    const authorizationHeader = request.headers['authorization']; // Get the authorization header
    if (!authorizationHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authorizationHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
      throw new UnauthorizedException('Wrong token');
    }

    this.authService.logout(token); // Blacklist the token
    return { message: 'Logged out successfully' };
  }
}
