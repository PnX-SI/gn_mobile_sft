import { TestBed } from "@angular/core/testing";

import { LocalVariablesService } from "./local-variables.service";

describe("LocalVariablesService", () => {
  let service: LocalVariablesService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(LocalVariablesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Settings getter work", () => {
    expect(service.getSettings()).toBe(JSON);
  });
});
