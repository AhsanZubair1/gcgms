import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RolesEntity } from '@src/roles/infrastructure/persistence/relational/entities/roles.entity';
import { RolesAbstractRepository } from '@src/roles/infrastructure/persistence/roles.abstract.repository';

@Injectable()
export class RolesRelationalRepository implements RolesAbstractRepository {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
  ) {}
}
