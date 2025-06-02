import { ArmedForceBranch } from '@src/armed-force-branches/domain/armed-force-branch';
import { NullableType } from '@src/utils/types/nullable.type';

export abstract class ArmedForceBranchAbstractRepository {
  abstract findAllWithPagination(): Promise<ArmedForceBranch[]>;

  abstract findById(
    id: ArmedForceBranch['id'],
  ): Promise<NullableType<ArmedForceBranch>>;
}
