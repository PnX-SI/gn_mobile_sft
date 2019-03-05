import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputOsbEtDatePage } from './input-osb-et-date.page';

describe('InputOsbEtDatePage', () => {
  let component: InputOsbEtDatePage;
  let fixture: ComponentFixture<InputOsbEtDatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputOsbEtDatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputOsbEtDatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
