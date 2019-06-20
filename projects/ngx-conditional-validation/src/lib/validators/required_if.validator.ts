import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

import { equal } from './equal.validator';
import { custom } from './custom.validator';

export function requiredIf(conditions: { [ key: string]: any }, controls?: (AbstractControl | string)[]): ValidatorFn;
export function requiredIf(
  condition: (() => boolean) | { [ key: string]: any },
  controls?: (AbstractControl | string)[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof condition === 'function') {
      return custom(() => condition(), [ Validators.required ], controls)(control);
    } else if (condition instanceof Object) {
      return equal(condition, [ Validators.required ], controls)(control);
    }

    return null;
  };
}
