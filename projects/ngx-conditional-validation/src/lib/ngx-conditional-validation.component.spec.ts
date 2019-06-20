import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxConditionalValidationComponent } from './ngx-conditional-validation.component';

describe('NgxConditionalValidationComponent', () => {
  let component: NgxConditionalValidationComponent;
  let fixture: ComponentFixture<NgxConditionalValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxConditionalValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxConditionalValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
