import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ExtraControl, UtilsValidator } from './utils.class';

/**
 * Custom validation with condition
 * @param state condition to set the validators
 * @param validators validators array to set
 * @param controls controls to detect changes in their values
 */
export function custom(
  state: () => boolean,
  validators: ValidatorFn[],
  controls?: (AbstractControl | string)[]): ValidatorFn {
  return (control: ExtraControl): { [ key: string]: any } | null => {
    UtilsValidator.cleanChangeSubscriptions(control);
    UtilsValidator.pushChangeSubscriptions(control, UtilsValidator.toRealControls(control, controls));

    if (typeof state === 'function' && state.call(control.parent)) {
      for (const validator of validators) {
        const errors = validator(control);

        if (errors !== null) {
          return errors;
        }
      }
    }

    return null;
  };
}
