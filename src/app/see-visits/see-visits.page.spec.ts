import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeVisitsPage } from './see-visits.page';

describe('SeeVisitsPage', () => {
  let component: SeeVisitsPage;
  let fixture: ComponentFixture<SeeVisitsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeVisitsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeVisitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
