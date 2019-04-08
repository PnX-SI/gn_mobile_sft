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
  //variable de la page pour qu'on lise les données
  data =[];
  
  //chargement des imports
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
  //a l'initialisation
	this.platform.ready().then(() => {//on attend que la plateforme soit prête
    //on préshot tout ce qui doit être load
    this.statusBar.styleDefault();
    this.splashScreen.hide(); 
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.offlineManager.checkForEvents().subscribe();
      }
    });
    this.loadData(true);//on charge des données
    

	});
  }

  loadData(refresh = false, refresher?) {
    //on part chercher des données dans l'API
    this.apiService.getData(refresh).subscribe(res => {
    data = res;//on fait que la variable exporté soit égale aux données
    this.data = data; //on fait que la variable interne le soit aussi
      if (refresher) {
        refresher.target.complete();
      }
    });
  }

  watchArea(id)
  {
    //au clique du bouton, envoi sur la page visionnage
    this.router.navigate(['/visionnage',{id:id}]);	
  }
}

export var data