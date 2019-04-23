import { TestBed } from '@angular/core/testing';

import { LocalVariablesService } from './local-variables.service';

describe('LocalVariablesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalVariablesService = TestBed.get(LocalVariablesService);
    expect(service).toBeTruthy();
  });
});
