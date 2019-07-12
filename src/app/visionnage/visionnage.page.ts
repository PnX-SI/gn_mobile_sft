import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Storage } from "@ionic/storage";
import { File } from "@ionic-native/file/ngx";
import { WebView } from "@ionic-native/ionic-webview";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";

import "leaflet";
import "leaflet-tilelayer-mbtiles-ts";
import * as geoJSON from "geojson";

declare var L: any;
import { ApiService } from "../services/api.service";
import { ConnectionStatus, NetworkService } from "../services/network.service";
import { LocalVariablesService } from "../services/local-variables.service";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-visionnage",
  templateUrl: "./visionnage.page.html",
  styleUrls: ["./visionnage.page.scss"]
})
export class VisionnagePage implements OnInit {
  //variables de la page
  public id;
  map: L.Map;
  data = [];
  userPosPoint;
  nomCommune;
  nomTaxon;

  //chargement des imports
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private storage: Storage,
    private file: File,
    private networkService: NetworkService,
    private local: LocalVariablesService,
    private diagnostic: Diagnostic,
    private alert: AlertController
  ) {
    //on lis les paramêtres qu'on a passé
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.loadData(true, "visite", this.id); //on charge des données
    });
  }

  loadData(refresh = false, type = "base", id = 0, refresher?) {
    //on part chercher des données dans l'API
    this.apiService.getData(refresh, type, id).subscribe(res => {
      this.data = res; //on fait que la variable exporté soit égale aux données
      if (refresher) {
        refresher.target.complete();
      }
      this.reload();
    });
  }

  ionViewDidEnter() //quand on rentre dans la page
  {
    this.storage.get("visiteSite" + this.id).then(res => {
      if (res) {
        this.alert
          .create({
            header: "Information",
            message:
              "Vous avez déjà visité ce site. Enregistrer une visite écrasera l'ancienne.",
            buttons: [
              {
                text: "Ok",
                handler: () => {}
              }
            ]
          })
          .then(alert => {
            alert.present();
          });
      }
    });
    //on fait en sorte que la carte soit affiché
    this.diagnostic.getExternalSdCardDetails().then(
      res => {
        console.log(res);
        if (res.length > 0) {
          //y a une carte sd
          //Carte locale (dossier de tuiles)
          var pathToFile =
            res[0]["path"] +
            this.local.getSettings()["TilesPath"] +
            this.local.getSettings()["TilesDirectory"];
          var truePath = WebView.convertFileSrc(pathToFile);
          console.log("tuiles chargé");
          L.tileLayer(truePath + "/{z}/{x}/{y}.png", {
            maxZoom: this.local.getSettings()["MaxZoomLevel"],
            attribution: "local"
          }).addTo(this.map);
        } //y en a pas, on cherche dans les fichiers internes
        else {
          this.file
            .checkDir(
              this.file.externalDataDirectory +
                this.local.getSettings()["TilesPath"].slice(1),
              this.local.getSettings()["TilesDirectory"]
            )
            .then(
              res => {
                //on trouve une carte locale
                //Carte locale (dossier de tuiles)
                var pathToFile =
                  this.file.externalDataDirectory +
                  this.local.getSettings()["TilesPath"].slice(1) +
                  this.local.getSettings()["TilesDirectory"];
                var truePath = WebView.convertFileSrc(pathToFile);
                console.log("tuiles chargé");
                L.tileLayer(truePath + "/{z}/{x}/{y}.png", {
                  maxZoom: this.local.getSettings()["MaxZoomLevel"],
                  attribution: "local"
                }).addTo(this.map);
              },
              err => {
                //on ne trouve pas de carte locale
                //Carte online
                L.tileLayer(this.local.getSettings()["Online_Leaflet_URL"], {
                  // tslint:disable-next-line
                  attribution:
                    "&copy;" + this.local.getSettings()["Online_Attribution"],
                  maxZoom: this.local.getSettings()["MaxZoomLevel"]
                }).addTo(this.map);
              }
            );
        }
      },
      err => {
        console.error(err);
        //on ne trouve pas de carte locale
        //Carte online
        L.tileLayer(this.local.getSettings()["Online_Leaflet_URL"], {
          // tslint:disable-next-line
          attribution:
            "&copy;" + this.local.getSettings()["Online_Attribution"],
          maxZoom: this.local.getSettings()["MaxZoomLevel"]
        }).addTo(this.map);
      }
    );
  }

  ngOnInit() //quand on créé la page
  {
    //assignation de la carte
    this.map = new L.Map("mapVisio");
    //on fait en sorte que la carte ai une échelle (pour se repérer c'est cool)
    L.control.scale().addTo(this.map);
    //on setup ce qu'il se passe si on géolocalise l'utilisateur (on s'en fout de pas le trouver)
    this.map.on("locationfound", e => {
      this.onLocationFound(e);
    });
  }

  reload() //fonction de (re)chargement
  {
    //on recharge rapidement la carte
    this.map.invalidateSize();
    this.nomCommune = this.data[0]["properties"]["nom_commune"];
    this.nomTaxon = this.data[0]["properties"]["nom_taxon"];

    //on géolocalise un utilisateur
    this.map.locate({
      setView: false,
      maxZoom: 11
    });

    //on met les données sur la carte
    var objet = L.geoJSON(this.data[0]).addTo(this.map);
    //on centre l'utilisateur sur ce qui l'intéresse
    this.map.setView(objet.getBounds().getCenter(), 16);
  }

  GoToNewVisit() {
    //on met l'utilisateur sur new visit avec la carte qui correspond
    this.router.navigate(["/new-visit", { id: this.id }]);
  }

  GoBack() {
    //on met l'utilisateur sur start-input
    this.router.navigate(["/start-input"]);
  }

  //quand on trouve l'utilisateur
  onLocationFound(e) {
    //on supprime le point
    if (this.userPosPoint) {
      this.userPosPoint.remove();
    }
    //on pose un marqueur sur sa position
    this.userPosPoint = L.circleMarker(e["latlng"], {
      color: "#FF8C00",
      fillOpacity: 1,
      radius: 3
    }).addTo(this.map);
  }
}
