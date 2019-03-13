import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionnagePage } from './visionnage.page';

describe('VisionnagePage', () => {
  let component: VisionnagePage;
  let fixture: ComponentFixture<VisionnagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisionnagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionnagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
