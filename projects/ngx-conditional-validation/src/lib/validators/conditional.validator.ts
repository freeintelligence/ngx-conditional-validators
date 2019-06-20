import { ValidatorFn, AbstractControl, FormControl } from '@angular/forms';

// @dynamic
export class ConditionalValidators {

  static custom(
    state: () => boolean,
    validators: ValidatorFn[],
    controls?: (FormControl | string)[]): ValidatorFn {
    return (control: AbstractControl): { [ key: string]: any } | null => {
      if (typeof state === 'function') {
        if (state()) {

        }
      }
      return null;
    };
  }

}
