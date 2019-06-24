import { NetworkService, ConnectionStatus } from "./services/network.service";
import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { File } from "@ionic-native/file/ngx";

import { OfflineManagerService } from "./services/offline-manager.service";
import { LocalVariablesService } from "./services/local-variables.service";

const settings = {
  API_URL: "http://demo.geonature.fr/geonature/api",
  API_Dir: "sft",
  Default_Lat: 44.5682846,
  Default_Lon: 6.0634622,
  mbTile_File: "cartes.mbtiles",
  TilesDirectory: "scan",
  Online_Leaflet_URL: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  Online_Attribution: "OpenTopoMap"
};

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
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
    private local: LocalVariablesService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    //a l'initialisation
    this.platform.ready().then(() => {
      //on attend que la plateforme soit prête
      //on préshot tout ce qui doit être load
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.networkService
        .onNetworkChange()
        .subscribe((status: ConnectionStatus) => {
          if (status == ConnectionStatus.Online) {
            this.offlineManager.checkForEvents().subscribe();
          }
        });

      //on vérifie la plateforme
      if (!this.platform.is("cordova") || !this.platform.is("android")) {
        alert(
          "vous n'êtes pas sur une plateforme android.\nCertaines fonctionnalités pourrait ne pas être disponible."
        );
        this.local.setSettings(settings);
      } else {
        /*on verifie l'existence des dossiers et fichiers qui nous interressent*/
        this.settings();
      }

      /**************************************************************/
    });
  }

  settings() {
    this.file.checkDir(this.file.externalDataDirectory, "settings").then(
      res => {
        this.file
          .checkFile(
            this.file.externalDataDirectory + "settings/",
            "settings.json"
          )
          .then(
            res => {
              console.log("settings.json trouvé");
              this.file
                .readAsBinaryString(
                  this.file.externalDataDirectory + "settings",
                  "settings.json"
                )
                .then(
                  res => {
                    console.log("lecture de settings.json");
                    this.local.setSettings(JSON.parse(res));
                  },
                  err => {
                    console.log("Erreur: settings.json illisible");
                  }
                );
            },
            err => {
              console.log("erreur: settings.json n'existe pas");
              this.file
                .createFile(
                  this.file.externalDataDirectory + "settings",
                  "settings.json",
                  true
                )
                .then(
                  FileEntry => {
                    this.file
                      .writeExistingFile(
                        this.file.externalDataDirectory + "settings",
                        "settings.json",
                        JSON.stringify(settings)
                      )
                      .then(res => {
                        console.log("ecriture dans settings.json avec succès");
                        this.file
                          .readAsBinaryString(
                            this.file.externalDataDirectory + "settings",
                            "settings.json"
                          )
                          .then(
                            res => {
                              console.log("lecture de settings.json");
                              this.local.setSettings(JSON.parse(res));
                              //verif dossier des mbtiles
                              this.mbtiles();
                            },
                            err => {
                              console.log("Erreur: settings.json illisible");
                            }
                          );
                      });
                  },
                  err => {
                    console.log("settings.json n'a pas pu être créé");
                  }
                );
            }
          );
      },
      err => {
        console.log("le dossier settings n'existe pas. Nous allons le créer");
        this.file
          .createDir(this.file.externalDataDirectory, "settings", false)
          .then(
            res => {
              this.file
                .createFile(
                  this.file.externalDataDirectory + "settings",
                  "settings.json",
                  true
                )
                .then(
                  FileEntry => {
                    console.log("settings.json créé avec succès");
                    this.file
                      .writeExistingFile(
                        this.file.externalDataDirectory + "settings",
                        "settings.json",
                        JSON.stringify(settings)
                      )
                      .then(res => {
                        console.log("ecriture dans settings.json avec succès");
                        this.file
                          .readAsBinaryString(
                            this.file.externalDataDirectory + "settings",
                            "settings.json"
                          )
                          .then(
                            res => {
                              console.log("lecture de settings.json");
                              this.local.setSettings(JSON.parse(res));
                              //verif dossier des mbtiles
                              this.mbtiles();
                            },
                            err => {
                              console.log("Erreur: settings.json illisible");
                            }
                          );
                      });
                  },
                  err => {
                    console.log("settings.json n'a pas pu être créé");
                  }
                );
            },
            err => {
              console.log("nous n'avons pas pu créer le dossier");
            }
          );
      }
    );
  }

  mbtiles() {
    //dossier des mbtiles
    this.file.checkDir(this.file.externalDataDirectory, "MBTilesLocales").then(
      res => {
        this.file
          .checkFile(
            this.file.externalDataDirectory + "MBTilesLocales/",
            this.local.getSettings()["mbTile_File"]
          )
          .then(
            res => {
              console.log("fichier de cartes présent");
            },
            err => {
              //TODO quand le téléchargement sera mis en place, changer le texte
              alert(
                "Vous devez placer le fichier " +
                  this.local.getSettings()["mbTile_File"] +
                  " dans le dossier: \n" +
                  this.file.externalDataDirectory +
                  "MBTilesLocales" +
                  "\npour avoir vos cartes en local"
              );
              //console.log("Vous devez placer le fichier \"cartes.mbtiles\" dans le dossier: \n"+this.file.externalDataDirectory+"MBTilesLocales"+"\npour avoir vos cartes en local")
            }
          );
      },
      err => {
        console.log(
          "le dossier MBTilesLocales n'existe pas. Nous allons le créer"
        );
        this.file
          .createDir(this.file.externalDataDirectory, "MBTilesLocales", false)
          .then(
            res => {
              //TODO quand le téléchargement sera mis en place, changer le texte
              alert(
                "Dossier de cartes locales créé. Vous devez placer le fichier " +
                  this.local.getSettings()["mbTile_File"] +
                  " dans le dossier: \n" +
                  this.file.externalDataDirectory +
                  "MBTilesLocales" +
                  "\npour avoir vos cartes en local"
              );
              //console.log("Dossier de cartes locales créé. Vous devez placer le fichier \"cartes.mbtiles\" dans le dossier: \n"+this.file.externalDataDirectory+"MBTilesLocales"+"\npour avoir vos cartes en local")
            },
            err => {
              console.log("nous n'avons pas pu créer le dossier");
            }
          );
      }
    );
  }
}
