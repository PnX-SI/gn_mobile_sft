import { async, TestBed } from "@angular/core/testing";

import { NetworkService } from "./network.service";
import { Network } from "@ionic-native/network/ngx";

describe("NetworkService", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [Network]
    });
  }));

  it("should be created", () => {
    const service: NetworkService = TestBed.get(NetworkService);
    expect(service).toBeTruthy();
  });
});
