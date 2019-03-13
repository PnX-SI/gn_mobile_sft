import { NetworkService, ConnectionStatus } from './services/network.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import {Router} from '@angular/router';

import { OfflineManagerService } from './services/offline-manager.service';
import { ApiService } from './services/api.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  
  data =[];
  identifiant;

  constructor(
	private platform: Platform,
	private splashScreen: SplashScreen,
	private statusBar: StatusBar,
	private router: Router,
	private offlineManager: OfflineManagerService,
	private networkService: NetworkService,
  private apiService: ApiService
  ) 
  {
	  this.initializeApp();
  }

  initializeApp() {
	this.platform.ready().then(() => {
	  this.statusBar.styleDefault();
    this.splashScreen.hide(); 
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.offlineManager.checkForEvents().subscribe();
      }
    });
    this.loadData(true);
    

	});
  }

  loadData(refresh = false, refresher?) {
    this.apiService.getData(refresh).subscribe(res => {
	  data = res;
	  this.data = data;
      if (refresher) {
        refresher.target.complete();
      }
    });
  }

  watchArea(id)
  {
    this.router.navigate(['/visionnage',{id:id}]);	
  }

  CancelVisit()
  {
    // code pour annuler la saisie
    this.router.navigate(['/start-input']);
  }
}

export var data