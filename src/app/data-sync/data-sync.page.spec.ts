import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSyncPage } from './data-sync.page';

describe('DataSyncPage', () => {
  let component: DataSyncPage;
  let fixture: ComponentFixture<DataSyncPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSyncPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSyncPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
