import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ConditionalValidators } from 'ngx-conditional-validation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  form: FormGroup = new FormGroup({
    isRequired: new FormControl(0, [ Validators.required ]),
    name: new FormControl(null),
  });

  constructor() {
    this.form.controls.name.setValidators([
      ConditionalValidators.custom(() => this.form.controls.isRequired.value === '1', [
        Validators.required
      ], [ 'isRequired' ])
    ]);
  }

}
