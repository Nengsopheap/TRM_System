import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../users/entity/users.entity';

@Injectable()
export class AuthService {
  private blacklistedTokens: Set<string> = new Set(); // In-memory blacklist

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Access denied');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateAdmin(email, password);
    const payload = { email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token); // Verify the token
      return payload ? { email: payload.email, role: payload.role } : null; // Return the payload if valid
    } catch (e) {
      return null; // Return null if the token is invalid or expired
    }
  }
  

  // Method to log out by blacklisting the JWT token
  logout(token: string) {
    this.blacklistedTokens.add(token);
  }

  // Method to check if a token is blacklisted
  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
