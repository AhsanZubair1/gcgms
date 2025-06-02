import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { PERMISSIONS_KEY } from '@src/roles/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const query = `
      SELECT 
        r.name AS role_name,
        ps.module AS permission_module,
        ps.action AS permission_action
      FROM gc_cms_users u
      LEFT JOIN gc_cms_user_roles ur ON ur.gc_cms_user_id = u.id
      LEFT JOIN gc_cms_roles r ON r.id = ur.role_id
      LEFT JOIN gc_cms_role_permissions rp ON rp.role_id = r.id
      LEFT JOIN gc_cms_permissions ps ON ps.id = rp.permission_id
      WHERE u.id = $1
    `;

    const result = await this.dataSource.query(query, [user.id]);

    if (result.length === 0) {
      throw new UnauthorizedException(
        'User has no assigned roles or permissions',
      );
    }

    const roles = [
      ...new Set(result.map((row) => row.role_name).filter(Boolean)),
    ];
    const permissions = [
      ...new Set(result.map((row) => row.permission_module).filter(Boolean)),
    ];

    const hasPermission = requiredPermissions.some((perm) =>
      permissions.includes(perm),
    );

    if (!hasPermission) {
      throw new UnauthorizedException(
        `Access denied. Required: ${requiredPermissions.join(
          ', ',
        )}. Your permissions: ${permissions.join(', ')}`,
      );
    }

    // Inject roles and permissions directly into request.user
    request.user.roles = roles;
    request.user.permissions = permissions;

    return true;
  }
}
