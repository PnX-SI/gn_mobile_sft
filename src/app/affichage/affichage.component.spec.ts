import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichagePage } from './affichage.page';

describe('AffichagePage', () => {
  let component: AffichagePage;
  let fixture: ComponentFixture<AffichagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffichagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffichagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
