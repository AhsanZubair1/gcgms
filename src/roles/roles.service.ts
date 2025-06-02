import { Injectable } from '@nestjs/common';

import { RolesAbstractRepository } from './infrastructure/persistence/roles.abstract.repository';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesAbstractRepository) {}
}
