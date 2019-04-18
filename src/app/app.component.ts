import { NetworkService, ConnectionStatus } from './services/network.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { File } from '@ionic-native/file/ngx'

import { OfflineManagerService } from './services/offline-manager.service';
import { ToastController } from '@ionic/angular';

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
    private file: File,
    private toastController : ToastController
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

    //on verifie l'existence des dossiers et fichiers qui nous interressent
    this.file.checkDir(this.file.dataDirectory,'settings').then(res =>{
      this.file.checkFile(this.file.dataDirectory+'settings','settings.json').then(res =>{
      }).catch(err =>{
        console.error("settings.json n'existe pas.")
        let toast = this.toastController.create({
          message: `settings.json n'existe pas.`,
          duration: 3000,
          position: 'bottom'
        });
        toast.then(toast => toast.present());
      })
    }).catch(err =>{
      console.error("le répertoire settings n'existe pas, nous allons le créer")
      let toast = this.toastController.create({
        message: `sle répertoire settings n'existe pas, nous allons le créer.`,
        duration: 3000,
        position: 'bottom'
      });
      toast.then(toast => toast.present());
      this.file.createDir(this.file.dataDirectory,'settings',false)
    })
	});
  }

}