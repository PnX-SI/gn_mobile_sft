import { NetworkService, ConnectionStatus } from './services/network.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import {Router} from '@angular/router';

import { OfflineManagerService } from './services/offline-manager.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  
  constructor(
	private platform: Platform,
	private splashScreen: SplashScreen,
	private statusBar: StatusBar,
  private router: Router,
  private offlineManager: OfflineManagerService,
  private networkService: NetworkService,
  ) {
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
	});
  }

  GoToNewVisit()
  {
	  this.router.navigate(['/new-visit',{taxon:'taxon'}])
  }

  CancelVisit()
  {
	// code pour annuler la saisie
	this.router.navigate(['/home'])
  }
}
