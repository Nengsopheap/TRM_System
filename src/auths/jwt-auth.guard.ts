import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auths.service';  // Import AuthService

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private authService: AuthService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    // Check if the token is blacklisted
    if (this.authService.isTokenBlacklisted(user.accessToken)) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    return user;
  }
}
