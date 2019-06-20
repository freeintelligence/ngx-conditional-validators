import { ValidatorFn, AbstractControl, FormControl } from '@angular/forms';

export function ConditionalValidators(
  states: { [ key: string]: any },
  validators: ValidatorFn[],
  controls?: (FormControl | string)[]): ValidatorFn;
export function ConditionalValidators(
  state: { [ key: string]: any } | (() => boolean),
  validators: ValidatorFn[],
  controls?: (FormControl | string)[]): ValidatorFn {
  return (control: AbstractControl): { [ key: string]: any } | null => {
    if (typeof state === 'function') {
      if (state()) {

      }
    } else if (state instanceof Object) {

    }
    return null;
  };
}
