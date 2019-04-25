import { OfflineManagerService } from './offline-manager.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";
import {LocalVariablesService} from './local-variables.service'
  
//const API_URL = 'http://demo.geonature.fr/geonature/api'; //API test
//const API_URL = 'http://51.75.122.69/geonature/api'; //API prod
//const API_REPO = 'sft' //API test
//const API_REPO = 'suivi_flore_territoire' //API prod

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  //API_URL = this.local.getSettings()['API_URL']
  //API_REPO = this.local.getSettings()['API_Dir']

  constructor
  (
    private http: HttpClient, 
    private networkService: NetworkService, 
    private storage: Storage, 
    private offlineManager: OfflineManagerService,
    private local: LocalVariablesService
    
    ) {

    }
 
  getData(forceRefresh: boolean = false, requeteType: string = "base", id: number = 0): Observable<any> {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      // Return the cached data from Storage
      if (requeteType == "base")
      {
        return from(this.getLocalData('base'));
      }
      else if (requeteType == "maille")
      {
        return from(this.getLocalData('maille'+id));
      }
      else if (requeteType == "visite")
      {
        return from(this.getLocalData('visite'+id));
      }
      else if(requeteType == "observeur")
      {
        return from(this.getLocalData('observeur'))
      }
      else if(requeteType == "perturbations")
      {
        return from(this.getLocalData('perturbations'))
      }

    } else {      
      // Return real API data and store it locally
      
      if (requeteType == "base")
      {
        //console.log("api url:"+this.local.getSettings()['API_URL']+" api dir:"+this.local.getSettings()['API_Dir'])
        return this.http.get(`${this.local.getSettings()['API_URL']}/${this.local.getSettings()['API_Dir']}/sites?id_application=7&id_area_type=25`).pipe(
          map(res => 
            res['features']
          ),
          catchError(err => {
            console.error(err);
            console.log("renvoi des données locales");

            return from(this.getLocalData('base'));
          })
        )
      }
      else if (requeteType == "visite")
      {
        return this.http.get(`${this.local.getSettings()['API_URL']}/${this.local.getSettings()['API_Dir']}/sites?id_base_site=${id}`).pipe(
          map(res => 
            res['features']
          ),
          catchError(err => {
            console.error(err);
            console.log("renvoi des données locales");
            return from(this.getLocalData('visite'+id));
          })
        )
      }
      else if (requeteType == "maille")
      {
        return this.http.get(`${this.local.getSettings()['API_URL']}/gn_monitoring/siteareas/${id}?id_area_type=32`).pipe(
          map(res => 
            res['features']
          ),
          catchError(err => {
            console.error(err);
            console.log("renvoi des données locales");
            return from(this.getLocalData('maille'+id));
          })
        )
      }
      else if (requeteType == "observeur")
      {
        return this.http.get(`${this.local.getSettings()['API_URL']}/users/menu/1`).pipe(
          map(res =>
            [res]
          ),
          catchError(err => {
            console.error(err);
            console.log("renvoi des données locales");
            return from(this.getLocalData('observeur'));
          })
        )
      }
      else if (requeteType == "perturbations")
      {
        return this.http.get(`${this.local.getSettings()['API_URL']}/nomenclatures/nomenclature/TYPE_PERTURBATION?regne=&group2_inpn=&orderby=label_default`).pipe(
          map(res =>
            res['values']
          ),
          catchError(err => {
            console.error(err);
            console.log("renvoi des données locales");
            return from(this.getLocalData('perturbations'));
          })
        )
      }
      
    }
  }
 
  /*updateUser(user, data): Observable<any> {
    let url = `${API_URL}/users/${user}`;
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.offlineManager.storeRequest(url, 'PUT', data));
    } else {
      return this.http.put(url, data).pipe(
        catchError(err => {
          this.offlineManager.storeRequest(url, 'PUT', data);
          throw new Error(err);
        })
      );
    }
  }*/

  public LogInAPI(log, pswd)
  {
    reponse = null
    const user = {
      login:log,
      password:pswd,
      id_application: 3
    }
    //TODO: quand on pourra récupérer le token, le stocker au lieu de user
    this.http.post(`${this.local.getSettings()['API_URL']}/auth/login`,user,{headers:{}, observe: "response" as "response", withCredentials : true})
    .pipe(
      catchError(err =>{ throw err})
    )
    .subscribe(
      data=>{
        this.storage.set("user",user)
        reponse = data
      },
      err =>{
        reponse = err
      }
    )
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