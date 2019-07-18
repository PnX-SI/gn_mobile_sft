import { async, TestBed } from "@angular/core/testing";

import { ApiService } from "./api.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { Network } from "@ionic-native/network/ngx";
import { Storage } from "@ionic/storage";

describe("ApiService", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        Network,
        {
          provide: Storage,
          useValue: () => {
            return new Storage({});
          }
        }
      ]
    });
  }));

  it("should be created", () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });
});
