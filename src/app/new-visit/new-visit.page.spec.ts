import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVisitPage } from './new-visit.page';

describe('NewVisitPage', () => {
  let component: NewVisitPage;
  let fixture: ComponentFixture<NewVisitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVisitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVisitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
