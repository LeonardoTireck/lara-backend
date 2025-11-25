import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../../../domain/ValueObjects/UserType';

export const Roles = (roles: UserType[]) => SetMetadata('roles', roles);
