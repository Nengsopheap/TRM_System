import { Module } from '@nestjs/common';
import { AuthService } from './auths.service';
import { AuthController } from './auths.controller';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';  // Import the strategy
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule, // Ensure UsersModule is imported
    PassportModule,
    JwtModule.register({
      secret: 'your_secret_key',  // Replace with an actual secret or environment variable
      signOptions: { expiresIn: '1h' },  // Set the token expiry time
    }),
  ],
  providers: [AuthService, JwtStrategy],  // Add JwtStrategy here in providers
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
