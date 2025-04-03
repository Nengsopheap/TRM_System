import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/entity/users.entity';

export const Role = (role: UserRole) => SetMetadata('role', role);
