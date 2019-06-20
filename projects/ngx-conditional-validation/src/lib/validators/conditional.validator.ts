import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
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
      this.pushChangeSubscriptions(control, this.toRealControls(control, controls));

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

  static equal(conditions: { [ key: string]: any }, validators: ValidatorFn[], controls?: (AbstractControl | string)[]): ValidatorFn {
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
        const conditionalControl = this.getControlByName(controlName, control.parent as FormGroup);

        if (conditionalControl && controls.findIndex(e => e === conditionalControl) === -1) {
          controls.push(conditionalControl);
        }

        if (conditionalControl !== null && conditionalControl.value !== value) {
          validate = false;
          break;
        }
      }

      return this.custom(() => validate, validators, controls)(control);
    };
  }

  /**
   * Clean subscriptions for changes in control value
   * @param control controls array
   */
  private static cleanChangeSubscriptions(control: ExtraControl) {
    if (!(control.changeSubscriptions instanceof Array)) {
      control.changeSubscriptions = [];
    }

    for (const subscription of control.changeSubscriptions) {
      subscription.unsubscribe();
    }

    control.changeSubscriptions = [];
  }

  /**
   * Subscribe to changes in the values of the controls to validate the main control
   * @param control main control
   * @param controls controls array
   */
  private static pushChangeSubscriptions(control: ExtraControl, controls: (AbstractControl | string)[]) {
    if (!(control.changeSubscriptions instanceof Array)) {
      control.changeSubscriptions = [];
    }

    controls = this.toRealControls(control, controls);

    for (const conditionControl of controls) {
      const realControl: AbstractControl = typeof conditionControl === 'string' ?
      this.getControlByName(conditionControl, control.parent as FormGroup) :
      conditionControl;

      if (realControl === null) {
        throw new Error(`The "${conditionControl}" control does not exist.`);
      }

      const subscription = realControl.valueChanges.subscribe(e => control.updateValueAndValidity());
      control.changeSubscriptions.push(subscription);
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

  /**
   * Get abstract control array
   * @param control main control
   * @param controls abstract controls or abstract controls name
   */
  private static toRealControls(control: AbstractControl, controls: (AbstractControl | string)[]): AbstractControl[] {
    const data = [];

    if (!(controls instanceof Array)) {
      controls = [];
    }

    for (const conditionControl of controls) {
      const realControl: AbstractControl = typeof conditionControl === 'string' ?
      this.getControlByName(conditionControl, control.parent as FormGroup) :
      conditionControl;

      if (realControl === null) {
        throw new Error(`The "${conditionControl}" control does not exist.`);
      }

      data.push(realControl);
    }

    return data;
  }

}
