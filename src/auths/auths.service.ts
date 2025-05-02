import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../users/entity/users.entity';

@Injectable()
export class AuthService {
  private blacklistedTokens: Set<string> = new Set();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserRole(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    console.log('Login attempt email:', email);
    console.log('User found in DB:', user);
  
    if (!user) {
      console.log('❌ No user found');
      throw new UnauthorizedException('Access denied');
    }
  
    console.log('User role:', user.role);
  
    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch);
  
    if (!passwordMatch) {
      console.log('❌ Password does not match');
      throw new UnauthorizedException('Invalid credentials');
    }
  
    return user;
  }
  

  async login(email: string, password: string) {
    const user = await this.validateUserRole(email, password);
    const payload = { email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload ? { email: payload.email, role: payload.role } : null;
    } catch (e) {
      return null;
    }
  }

  logout(token: string) {
    this.blacklistedTokens.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
