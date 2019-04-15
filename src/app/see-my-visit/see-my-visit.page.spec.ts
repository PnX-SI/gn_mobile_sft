import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeMyVisitPage } from './see-my-visit.page';

describe('SeeMyVisitPage', () => {
  let component: SeeMyVisitPage;
  let fixture: ComponentFixture<SeeMyVisitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeMyVisitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeMyVisitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
