import { ValidatorFn, AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

interface ExtraControl extends AbstractControl {
  changeSubscriptions: Subscription[];
}

// @dynamic
/**
 * Conditional validators
 */
export class ConditionalValidators {

  /**
   * Custom validation with condition
   * @param state condition to set the validators
   * @param validators validators array to set
   * @param controls controls to detect changes in their values
   */
  static custom(
    state: () => boolean,
    validators: ValidatorFn[],
    controls?: (AbstractControl | string)[]): ValidatorFn {
    return (control: ExtraControl): { [ key: string]: any } | null => {
      this.cleanChangeSubscriptions(control);
      this.pushChangeSubscriptions(control, controls);

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

  /**
   * Clean subscriptions for changes in control value
   * @param control controls array
   */
  private static cleanChangeSubscriptions(control: ExtraControl) {
    if (!(control.changeSubscriptions instanceof Array)) {
      control.changeSubscriptions = [ ];
    }

    for (const subscription of control.changeSubscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Subscribe to changes in the values of the controls to validate the main control
   * @param control main control
   * @param controls controls array
   */
  private static pushChangeSubscriptions(control: ExtraControl, controls: (AbstractControl | string)[]) {
    if (!(control.changeSubscriptions instanceof Array)) {
      control.changeSubscriptions = [ ];
    }
    if (!(controls instanceof Array)) {
      controls = [ ];
    }

    for (const conditionControl of controls) {
      const realControl: AbstractControl = typeof conditionControl === 'string' ?
      this.getControlByName(conditionControl, control.parent as FormGroup) :
      conditionControl;

      if (realControl === null) {
        throw new Error(`The "${conditionControl}" control does not exist.`);
      }

      realControl.valueChanges.subscribe(e => control.updateValueAndValidity());
    }
  }

  /**
   * Get the control object from group parent
   * @param name control name to get
   * @param group group parent
   */
  private static getControlByName(name: string, group: FormGroup): AbstractControl {
    for (const key in group.controls) {
      if (key === name) {
        return group.controls[key];
      }
    }

    return null;
  }

}
