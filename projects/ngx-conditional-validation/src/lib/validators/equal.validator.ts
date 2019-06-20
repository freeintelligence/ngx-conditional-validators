import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { ExtraControl, UtilsValidator } from './utils.class';

import { custom } from './custom.validator';

/**
 * Validation with condition equal to value
 * @param conditions conditions like object (key is control name)
 * @param validators validators array
 * @param controls controls to detect changes in their values
 */
export function equal(
  conditions: { [ key: string]: any },
  validators: ValidatorFn[],
  controls?: (AbstractControl | string)[]): ValidatorFn {
  return (control: ExtraControl): { [ key: string]: any } | null => {
    if (!(controls instanceof Array)) {
      controls = [];
    }

    let validate = true;

    for (const controlName in conditions) {
      if (!conditions.hasOwnProperty(controlName)) {
        continue;
      }

      const value = conditions[controlName];
      const conditionalControl = UtilsValidator.getControlByName(controlName, control.parent as FormGroup);

      if (conditionalControl && controls.findIndex(e => e === conditionalControl) === -1) {
        controls.push(conditionalControl);
      }

      if (conditionalControl !== null && conditionalControl.value !== value) {
        validate = false;
        break;
      }
    }

    return custom(() => validate, validators, controls)(control);
  };
}
