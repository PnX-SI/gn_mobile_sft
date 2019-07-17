import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginPage } from "./login.page";
import { Router, ActivatedRoute } from "@angular/router";
import { Network } from "@ionic-native/network/ngx";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { Storage } from "@ionic/storage";

describe("LoginPage", () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: class {
            navigate = jasmine.createSpy("navigate");
          }
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: {} } }
        },
        Network,
        HttpClient,
        HttpHandler,
        {
          provide: Storage,
          useValue: () => {
            return new Storage({});
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
