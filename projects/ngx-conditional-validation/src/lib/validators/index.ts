export * from './utils.class';

import { custom } from './custom.validator';
import { equal } from './equal.validator';
import { requiredIf } from './required_if.validator';

export const ConditionalValidators = {
  custom,
  equal,
  requiredIf,
};
