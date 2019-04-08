import { OfflineManagerService } from './offline-manager.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";
import { SessionService } from './session.service';
 
const API_STORAGE_KEY = 'specialkey';
const API_URL = 'http://demo.geonature.fr/geonature/api'; //API test
//const API_URL = 'http://51.75.122.69/geonature/api'; //API prod
const API_REPO = 'sft' //API test
//const API_REPO = 'suivi_flore_territoire' //API prod


@Injectable({
  providedIn: 'root'
})
export class ApiService {
 
  constructor
  (
    private http: HttpClient, 
    private networkService: NetworkService, 
    private storage: Storage, 
    private offlineManager: OfflineManagerService,
    private session : SessionService
    ) { }
 
  getData(forceRefresh: boolean = false, requeteType: string = "base", id: number = 0): Observable<any[]> {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      // Return the cached data from Storage
      
      if (requeteType == "base")
      {
        return from(this.getLocalData('base'));
      }
      else if (requeteType == "maille")
      {
        return from(this.getLocalData('maille'));
      }

    } else {      
      // Return real API data and store it locally
      
      if (requeteType == "base")
      {
        return this.http.get(`${API_URL}/${API_REPO}/sites?id_application=7&id_area_type=25`).pipe(
          map(res => 
            res['features']
          ),
          tap(res => {
            this.setLocalData('base', res);
          })
        )
      }
      else if (requeteType == "maille")
      {
        return this.http.get(`${API_URL}/gn_monitoring/siteareas/${id}?id_area_type=32`).pipe(
          map(res => 
            res['features']
          ),
          tap(res => {
            this.setLocalData('maille', res);
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

  //TODO: Faire que ça marche
  LogInAPI()
  {
    const user = {
      login:this.session.getLogin(),
      password:this.session.getPassword(),
      id_application: 3
    }
    return this.http.post(`${API_URL}/auth/login`,user)
  }
 
  // Save result of API requests
  private setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }
 
  // Get cached API result
  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }
}