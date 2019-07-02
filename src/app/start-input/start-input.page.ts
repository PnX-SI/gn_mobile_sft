import { Component, OnInit } from "@angular/core";
import { MenuController, IonicModule } from "@ionic/angular";
import { Router } from "@angular/router";
import { File } from "@ionic-native/file/ngx";
import { WebView } from "@ionic-native/ionic-webview";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";

import { ApiService } from "../services/api.service";
import { LocalVariablesService } from "../services/local-variables.service";

import "leaflet";
import "leaflet-tilelayer-mbtiles-ts";
import * as geoJSON from "geojson";
import { cordova } from "@ionic-native/core";

declare var L: any;

@Component({
  selector: "app-start-input",
  templateUrl: "./start-input.page.html",
  styleUrls: ["./start-input.page.scss"]
})
export class StartInputPage implements OnInit {
  //variables de la page
  map: L.Map;
  userPosPoint;
  data: geoJSON.FeatureCollection;
  testeur = 0;
  modif = 100;
  eventInterval;

  organismes;

  default_Lat = 0;
  default_Long = 0;
  //chargement des imports
  constructor(
    private menu: MenuController,
    private router: Router,
    private apiService: ApiService,
    private local: LocalVariablesService,
    private file: File,
    private diagnostic: Diagnostic
  ) {
    this.loadData(true); //on charge des données
    this.loadDataOrg(true, "organisme");
  }

  loadData(refresh = false, type = "base", refresher?) {
    //on part chercher des données dans l'API
    this.apiService.getData(refresh, type).subscribe(res => {
      this.data = res; //on fait que la variable exporté soit égale aux données
      if (refresher) {
        refresher.target.complete();
      }
      this.reload(); //on appel un chargement de page
    });
  }
  loadDataOrg(refresh = false, type = "base", refresher?) {
    //on part chercher des données dans l'API
    this.apiService.getData(refresh, type).subscribe(res => {
      this.organismes = res; //on fait que la variable exporté soit égale aux données
      if (refresher) {
        refresher.target.complete();
      }
      this.reload(); //on appel un chargement de page
    });
  }

  ionViewDidEnter() //quand on rentre dans la page
  {
    //on fait en sorte que la carte soit affiché
    this.diagnostic.getExternalSdCardDetails().then(
      res => {
        //Carte locale (dossier de tuiles)
        /*var pathToFile =
            this.file.externalRootDirectory +
            this.local.getSettings()["TilesDirectory"];
          var truePath = WebView.convertFileSrc(pathToFile);
          console.log("mbtile chargé");
          L.tileLayer(truePath + "/{z}/{x}/{y}.png", {
            maxZoom: this.local.getSettings()["MaxZoomLevel"],
            attribution: "local"
          }).addTo(this.map);*/
        alert("test soft");
      },
      err => {
        console.error(err);
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
    //assiniation de la carte
    this.map = new L.Map("mapProspec");
    //ont met un bouton pour ce recentrer
    var centrer = L.Control.extend({
      options: {
        position: "topleft"
      },
      onAdd: map => {
        var container = L.DomUtil.create(
          "input",
          "leaflet-bar leaflet-control leaflet-control-custom"
        );
        container.type = "button";
        container.style["background-image"] =
          'url("../../assets/icon/md-locate.svg")';
        container.style.backgroundColor = "white";
        container.style.width = "35px";
        container.style.height = "35px";

        container.onclick = function() {
          map.locate({
            setView: false,
            maxZoom: 11
          });
        };
        return container;
      }
    });
    this.map.addControl(new centrer(this.map));
    //on fait en sorte que la carte ai une échelle (pour se repérer c'est cool)
    L.control.scale().addTo(this.map);
    this.default_Lat = this.local.getSettings()["Default_Lat"];
    this.default_Long = this.local.getSettings()["Default_Lon"];
    console.log("Lat =" + this.default_Lat);
    console.log("lon =" + this.default_Long);
    //on setup ce qu'il se passe quand on tente de géolocaliser l'utilisateur
    this.map.on("locationfound", e => {
      this.onLocationFound(e);
    });
    this.map.on("locationerror", e => {
      this.onLocationError(e);
    });
  }

  ionViewDidLeave() {
    //on ferme l'affichage
    document.getElementById("affichageGeneral").style.left = "100%";
    document.getElementById("affichageGeneral").style.right = "-75%";
    this.modif = 100;
  }

  reload() //fonction de (re)chargement
  {
    //on montre qu'on charge des truc
    document.getElementById("affichChargement").removeAttribute("hidden");
    //on ferme l'affichage
    clearInterval(this.eventInterval);
    this.eventInterval = setInterval(() => this.animAffic(true), 1);
    //on active le bon menu
    this.menu.enable(true, "VisuTaxon");
    //on recharge rapidement la carte
    this.map.invalidateSize();

    //on géolocalise un utilisateur
    this.map.locate({
      setView: false,
      maxZoom: 11
    });

    //on met les données sur la carte, et on y assigne une fonction
    L.geoJSON(this.data, {
      onEachFeature: (feature, layer) => {
        layer.on("click", () =>
          //au clique, envoi sur la page visionnage qui correspond
          {
            this.router.navigate(["/visionnage", { id: feature.id }]);
          }
        );
      }
    }).addTo(this.map);
  }

  //quand on trouve l'utilisateur
  onLocationFound(e) {
    this.map.setView(/*centre*/ [e["latitude"], e["longitude"]], /*zoom*/ 11);
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
    //on indique qu'on a fini de charger
    for (const feature in this.data) {
      if (
        L.geoJSON(this.data[feature])
          .getBounds()
          .contains([e["latitude"], e["longitude"]])
      ) {
        var validation = confirm(
          "Vous êtes détecté comme vous trouvant sur le site suivant :\r" +
            "Espèce : " +
            this.data[feature]["properties"]["nom_taxon"] +
            "\r" +
            "Commune : " +
            this.data[feature]["properties"]["nom_commune"] +
            "\r\r" +
            "Voulez-vous visiter ce site ?"
        );
        if (validation) {
          this.watchArea(parseInt(feature) + 1);
          break;
        }
      }
    }
    document.getElementById("affichChargement").setAttribute("hidden", null);
  }

  //quand on ne trouve pas l'utilisateur
  onLocationError(e) {
    console.error(e.message); //on vois le message d'erreur sur la console
    alert(e.message + "\rNous allons afficher la carte par défaut"); //on dit pourquoi on l'as pas trouver
    //on met l'utilisateur sur la carte par défaut
    this.map.setView(
      /*centre*/ [this.default_Lat, this.default_Long],
      /*zoom*/ 11
    );
    //on indique qu'on a fini de charger
    document.getElementById("affichChargement").setAttribute("hidden", null);
  }

  GoToHome() {
    //on envoi l'utilisateur sur la page d'acceuil
    this.router.navigate(["/home"]);
  }

  watchArea(id) {
    //au clique du bouton, envoi sur la page visionnage
    this.router.navigate(["/visionnage", { id: id }]);
  }

  toggleAffichage() {
    if (this.modif > 25) {
      clearInterval(this.eventInterval);
      this.eventInterval = setInterval(() => this.animAffic(false), 1);
    } else {
      clearInterval(this.eventInterval);
      this.eventInterval = setInterval(() => this.animAffic(true), 1);
    }
  }

  animAffic(reverse: Boolean) {
    if (this.modif >= 25 && !reverse) {
      document.getElementById("affichageGeneral").style.left = this.modif + "%";
      document.getElementById("affichageGeneral").style.right =
        25 - this.modif + "%";
      this.modif--;
    } else if (this.modif <= 100 && reverse) {
      document.getElementById("affichageGeneral").style.left = this.modif + "%";
      document.getElementById("affichageGeneral").style.right =
        25 - this.modif + "%";
      this.modif++;
    } else {
      clearInterval(this.eventInterval);
    }
  }
}
