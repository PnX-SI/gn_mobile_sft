import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartInputPage } from './start-input.page';

describe('StartInputPage', () => {
  let component: StartInputPage;
  let fixture: ComponentFixture<StartInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartInputPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
