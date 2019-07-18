import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Router, ActivatedRoute } from "@angular/router";

import { NewVisitPage } from "./new-visit.page";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { Network } from "@ionic-native/network/ngx";
import { Storage } from "@ionic/storage";
import { File } from "@ionic-native/file/ngx";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";

describe("NewVisitPage", () => {
  let component: NewVisitPage;
  let fixture: ComponentFixture<NewVisitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewVisitPage],
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
        File,
        Diagnostic,
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
    fixture = TestBed.createComponent(NewVisitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
