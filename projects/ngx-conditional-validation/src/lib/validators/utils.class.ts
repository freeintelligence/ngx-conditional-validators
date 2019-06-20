import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface ExtraControl extends AbstractControl {
  changeSubscriptions: Subscription[];
}

// @dynamic
/**
 * Utils validators
 */
export class UtilsValidator {

  /**
   * Clean subscriptions for changes in control value
   * @param control controls array
   */
  static cleanChangeSubscriptions(control: ExtraControl) {
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
  static pushChangeSubscriptions(control: ExtraControl, controls: (AbstractControl | string)[]) {
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
  static getControlByName(name: string, group: FormGroup): AbstractControl {
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
  static toRealControls(control: AbstractControl, controls: (AbstractControl | string)[]): AbstractControl[] {
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
