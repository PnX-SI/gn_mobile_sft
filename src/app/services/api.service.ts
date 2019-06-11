import { OfflineManagerService } from "./offline-manager.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NetworkService, ConnectionStatus } from "./network.service";
import { Storage } from "@ionic/storage";
import { Observable, from } from "rxjs";
import { tap, map, catchError } from "rxjs/operators";
import { LocalVariablesService } from "./local-variables.service";

//const API_URL = 'http://demo.geonature.fr/geonature/api'; //API test
//const API_URL = 'http://51.75.122.69/geonature/api'; //API prod
//const API_REPO = 'sft' //API test
//const API_REPO = 'suivi_flore_territoire' //API prod

@Injectable({
  providedIn: "root"
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private networkService: NetworkService,
    private storage: Storage,
    private offlineManager: OfflineManagerService,
    private local: LocalVariablesService
  ) {}

  getData(
    forceRefresh: boolean = false,
    requeteType: string = "base",
    id: number = 0
  ): Observable<any> {
    if (
      this.networkService.getCurrentNetworkStatus() ==
        ConnectionStatus.Offline ||
      !forceRefresh
    ) {
      // Return the cached data from Storage
      if (requeteType == "base") {
        return from(this.getLocalData("base"));
      } else if (requeteType == "maille") {
        return from(this.getLocalData("maille" + id));
      } else if (requeteType == "visite") {
        return from(this.getLocalData("visite" + id));
      } else if (requeteType == "observeur") {
        return from(this.getLocalData("observeur"));
      } else if (requeteType == "perturbations") {
        return from(this.getLocalData("perturbations"));
      } else if (requeteType == "organisme") {
        return from(this.getLocalData("organisme"));
      }
    } else {
      // Return real API data

      if (requeteType == "base") {
        //console.log("api url:"+this.local.getSettings()['API_URL']+" api dir:"+this.local.getSettings()['API_Dir'])
        return this.http
          .get(
            `${this.local.getSettings()["API_URL"]}/${
              this.local.getSettings()["API_Dir"]
            }/sites?id_application=7&id_area_type=25`
          )
          .pipe(
            map(res => res["features"]),
            catchError(err => {
              console.error(err);
              console.log("renvoi des données locales");

              return from(this.getLocalData("base"));
            })
          );
      } else if (requeteType == "visite") {
        return this.http
          .get(
            `${this.local.getSettings()["API_URL"]}/${
              this.local.getSettings()["API_Dir"]
            }/sites?id_base_site=${id}`
          )
          .pipe(
            map(res => res["features"]),
            catchError(err => {
              console.error(err);
              console.log("renvoi des données locales");
              return from(this.getLocalData("visite" + id));
            })
          );
      } else if (requeteType == "maille") {
        return this.http
          .get(
            `${
              this.local.getSettings()["API_URL"]
            }/gn_monitoring/siteareas/${id}?id_area_type=32`
          )
          .pipe(
            map(res => res["features"]),
            catchError(err => {
              console.error(err);
              console.log("renvoi des données locales");
              return from(this.getLocalData("maille" + id));
            })
          );
      } else if (requeteType == "observeur") {
        return this.http
          .get(`${this.local.getSettings()["API_URL"]}/users/menu/1`)
          .pipe(
            map(res => [res]),
            catchError(err => {
              console.error(err);
              console.log("renvoi des données locales");
              return from(this.getLocalData("observeur"));
            })
          );
      } else if (requeteType == "perturbations") {
        return this.http
          .get(
            `${
              this.local.getSettings()["API_URL"]
            }/nomenclatures/nomenclature/TYPE_PERTURBATION?regne=&group2_inpn=&orderby=label_default`
          )
          .pipe(
            map(res => res["values"]),
            catchError(err => {
              console.error(err);
              console.log("renvoi des données locales");
              return from(this.getLocalData("perturbations"));
            })
          );
      } else if (requeteType == "organisme") {
        return this.http
          .get(
            `${this.local.getSettings()["API_URL"]}/${
              this.local.getSettings()["API_Dir"]
            }/organisme`
          )
          .pipe(
            map(res => res),
            catchError(err => {
              console.error(err);
              console.log("renvoi des données locales");
              return from(this.getLocalData("organisme"));
            })
          );
      }
    }
  }

  sendData(token, data) {
    let url = `${this.local.getSettings()["API_URL"]}/${
      this.local.getSettings()["API_Dir"]
    }/visitJWT`;
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline
    ) {
      alert(
        "Vous n'êtes pas connecté a internet. Les données n'ont pas été envoyées"
      );
      return null;
    } else {
      return this.http
        .post(url, data, {
          headers: { jwt: token }
        })
        .pipe(
          catchError(err => {
            throw err;
          })
        )
        .subscribe(
          mes => {
            console.log("données envoyées");
            console.log(mes);
            alert("ZP envoyé");
            this.storage.remove("visiteSite" + mes["id_base_site"]);
          },
          err => {
            console.error(err);
            alert("une erreur s'est produite");
          }
        );
    }
  }

  public LogInAPI(log, pswd) {
    reponse = null;
    const user = {
      login: log,
      password: pswd,
      id_application: 3
    };
    this.http
      .post(`${this.local.getSettings()["API_URL"]}/auth/login`, user, {
        headers: {},
        observe: "response" as "response",
        withCredentials: true
      })
      .pipe(
        catchError(err => {
          throw err;
        })
      )
      .subscribe(
        data => {
          this.storage.set("user", data.body);
          reponse = data;
          if (data.body["access_token"]) {
          } else {
            console.warn(
              "nous n'arrivons pas a trouver le token.\nModifiez l'api de manière à ce qu'elle renvoi le token"
            );
          }
        },
        err => {
          reponse = err;
        }
      );
  }

  // Save result of API requests
  public setLocalData(key, data) {
    //this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
    this.storage.set(`${key}`, data);
  }

  // Get cached API result
  public getLocalData(key) {
    //return this.storage.get(`${API_STORAGE_KEY}-${key}`);
    return this.storage.get(`${key}`);
  }
}

export var reponse;
