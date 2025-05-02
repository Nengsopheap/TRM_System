import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/entity/users.entity';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
    // Enable CORS
    app.enableCors({
      origin: 'http://localhost:5173', // or '*' to allow all origins
      credentials: true,
    });
  const usersService = app.get(UsersService);

  // Check if an admin exists
  const users = await usersService.findAll();
  const adminExists = users.some(user => user.role === UserRole.ADMIN);

  if (!adminExists) {
    console.log('No admin found, creating default admin...');
    await usersService.createUser('admin@example.com', 'admin123', UserRole.ADMIN);
    console.log('Admin user created! Email: admin@example.com, Password: admin123');
  }

  await app.listen(3000);
}
bootstrap();
