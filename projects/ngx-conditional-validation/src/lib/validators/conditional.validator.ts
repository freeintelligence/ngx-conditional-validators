import { ValidatorFn, AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

interface ExtraControl extends AbstractControl {
  changeSubscriptions: Subscription[];
}

// @dynamic
export class ConditionalValidators {

  private static cleanChangeSubscriptions(control: ExtraControl) {
    if (!(control.changeSubscriptions instanceof Array)) {
      control.changeSubscriptions = [ ];
    }

    for (const subscription of control.changeSubscriptions) {
      subscription.unsubscribe();
    }
  }

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

  private static getControlByName(name: string, group: FormGroup): AbstractControl {
    for (const key in group.controls) {
      if (key === name) {
        return group.controls[key];
      }
    }

    return null;
  }

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

}
