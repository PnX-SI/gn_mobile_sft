import { NetworkService, ConnectionStatus } from './services/network.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { OfflineManagerService } from './services/offline-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  //variable de la page pour qu'on lise les données
  
  //chargement des imports
  constructor(
	private platform: Platform,
	private splashScreen: SplashScreen,
	private statusBar: StatusBar,
	private offlineManager: OfflineManagerService,
	private networkService: NetworkService,
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
	});
  }

}