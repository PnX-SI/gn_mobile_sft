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

  initializeApp() 
  {
    //a l'initialisation
    this.platform.ready().then(() => 
    { //on attend que la plateforme soit prête
      //on préshot tout ce qui doit être load
      this.statusBar.styleDefault();
      this.splashScreen.hide(); 
      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => 
      {
        if (status == ConnectionStatus.Online) 
        {
          this.offlineManager.checkForEvents().subscribe();
        }
      });

      //on verifie l'existence des dossiers et fichiers qui nous interressent
      this.file.checkDir(this.file.dataDirectory,"settings").then(res =>
        {
          this.file.checkFile(this.file.externalDataDirectory,"settings.json").then(res =>
          {
            console.log("Tout fonctionne")
          },err =>
          {
            console.log("erreur: settings.json n'existe pas")
            this.file.createFile(this.file.externalDataDirectory,"settings.json",true).then(FileEntry =>
            {
              //this.file.writeExistingFile(this.file.externalDataDirectory,"settings.json","{test:true}")
            },err =>
            {
              console.log("settings.json n'a pas pu être créé")
            })
          })
        }, err=>
        {
        console.log("le dossier settings n'existe pas. Nous allons le créer")
        this.file.createDir(this.file.dataDirectory,"settings",false).then(res=>
        {
          this.file.createFile(this.file.externalDataDirectory,"settings.json",true).then(FileEntry =>
          {
            //this.file.writeExistingFile(this.file.externalDataDirectory,"settings.json","{test:true}")
          },err =>
          {
            console.log("settings.json n'a pas pu être créé")
          })
        }, err=>{
          console.log("nous n'avons pas pu créer le dossier")
        })
      });
    })
  }
}