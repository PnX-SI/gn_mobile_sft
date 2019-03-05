import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseObserverPage } from './choose-observer.page';

describe('ChooseObserverPage', () => {
  let component: ChooseObserverPage;
  let fixture: ComponentFixture<ChooseObserverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseObserverPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseObserverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
