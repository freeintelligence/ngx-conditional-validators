import { TestBed } from '@angular/core/testing';

import { NgxConditionalValidationService } from './ngx-conditional-validation.service';

describe('NgxConditionalValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxConditionalValidationService = TestBed.get(NgxConditionalValidationService);
    expect(service).toBeTruthy();
  });
});
