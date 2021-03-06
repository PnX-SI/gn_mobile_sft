import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { File } from "@ionic-native/file/ngx";
import { WebView } from "@ionic-native/ionic-webview";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";

import { ApiService } from "../services/api.service";

import "leaflet";
import "leaflet-tilelayer-mbtiles-ts";
import * as geoJSON from "geojson";
import { LocalVariablesService } from "../services/local-variables.service";
import { AlertController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

declare var L: any;

@Component({
  selector: "app-new-visit",
  templateUrl: "./new-visit.page.html",
  styleUrls: ["./new-visit.page.scss"]
})
export class NewVisitPage implements OnInit {
  //variables de la page
  map: L.Map;
  id;
  userPosPoint;
  visite = [];
  mailles: geoJSON.FeatureCollection;
  observer = [];
  perturbations = [];
  compteReload = 0;
  modif = 100;
  eventInterval;

  totalMailles = 0;
  maillesNonVisite = 0;
  maillesPresence = 0;
  maillesAbsence = 0;

  form = {
    commentaires: "",
    date: "",
    observers: [],
    perturbations: []
  };

  dataSend = {
    cor_visit_grid: [],
    id_base_visit: null,
    id_base_site: null,
    cor_visit_perturbation: [],
    comments: "",
    uuid_base_visit: null,
    id_digitiser: null,
    visit_date_max: null,
    cor_visit_observer: [],
    visit_date_min: null
  };

  //chargement des imports
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private file: File,
    private storage: Storage,
    private local: LocalVariablesService,
    private diagnostic: Diagnostic,
    private alert: AlertController
  ) {
    //on lis les paramêtres qu'on a passé
    this.route.params.subscribe(params => {
      this.id = params.id;
      //on call une lecture de données
      this.loadDataVisite(true, "visite", this.id);
      this.loadDataMailles(true, "maille", this.id);
      this.loadDataObserver(true, "observeur");
      this.loadDataPerturbations(true, "perturbations");
    });

    //paramettrage de la date par défaut
    var temps = new Date();
    var dateEcrit;
    if (temps.getMonth() < 10) {
      dateEcrit = temps.getFullYear() + "-0" + (temps.getMonth() + 1) + "-";
    } else {
      dateEcrit = temps.getFullYear() + "-" + (temps.getMonth() + 1) + "-";
    }

    if (temps.getDate() < 10) {
      dateEcrit = dateEcrit + "0" + temps.getDate();
    } else {
      dateEcrit = dateEcrit + temps.getDate();
    }
    this.form.date = dateEcrit;
  }

  /*fonctions de lecture de données*/
  loadDataVisite(refresh = false, type = "base", id, refresher?) {
    this.apiService.getData(refresh, type, id).subscribe(res => {
      this.visite = res[0];
      console.log("visite:");
      console.log(res[0]);
      if (refresher) {
        refresher.target.complete();
      }
    });
  }
  loadDataMailles(refresh = false, type = "base", id, refresher?) {
    this.apiService.getData(refresh, type, id).subscribe(res => {
      this.mailles = res;
      console.log("mailles:");
      console.log(res);

      this.totalMailles = res.length;
      this.maillesNonVisite = this.totalMailles;

      if (refresher) {
        refresher.target.complete();
      }

      this.reload(); //on appel un chargement de page
    });
  }
  loadDataObserver(refresh = false, type = "base", refresher?) {
    this.apiService.getData(refresh, type).subscribe(res => {
      this.observer = res[0];
      console.log("observers:");
      console.log(res[0]);
      if (refresher) {
        refresher.target.complete();
      }
    });
  }
  loadDataPerturbations(refresh = false, type = "base", refresher?) {
    this.apiService.getData(refresh, type).subscribe(res => {
      this.perturbations = res;
      console.log("perturbations:");
      console.log(res);
      if (refresher) {
        refresher.target.complete();
      }
    });
  }
  /*****************************/

  ionViewDidEnter() //quand on rentre dans la page
  {
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
    this.map = new L.Map("mapVisit");
    //on fait en sorte que la carte ai une échelle (pour se repérer c'est cool)
    L.control.scale().addTo(this.map);
    //on setup ce qu'il se passe si on géolocalise l'utilisateur (on s'en fout de pas le trouver)
    this.map.on("locationfound", e => {
      this.onLocationFound(e);
    });
  }

  ionViewDidLeave() {
    //on ferme l'affichage
    document.getElementById("affichageNewVisit").style.left = "100%";
    document.getElementById("affichageNewVisit").style.right = "-75%";
    this.modif = 100;
  }

  reload() //fonction de (re)chargement
  {
    this.map.locate({
      setView: false,
      maxZoom: 11,
      watch: true,
      enableHighAccuracy: true
    });
    //on montre qu'on charge des truc
    document.getElementById("affichChargement").removeAttribute("hidden");
    //on ferme l'affichage
    clearInterval(this.eventInterval);
    this.eventInterval = setInterval(() => this.animAffic(true), 1);
    //on recharge rapidement la carte
    this.map.invalidateSize();

    var objet = L.geoJSON(this.mailles, {
      onEachFeature: (feature, layer) => {
        layer.on("click", () =>
          //au clique, envoi sur la page visionnage qui correspond
          {
            var utilise = false;
            var presence = false;
            var id = 0;
            for (var i = 0; i < this.dataSend.cor_visit_grid.length; i++) {
              var element = this.dataSend.cor_visit_grid[i];
              if (element.id_area == feature.id) {
                utilise = true;
                presence = element.presence;
                id = i;
              }
            }

            if (utilise == false) {
              //pas vu to present
              layer["setStyle"]({ color: "#00FF00" });
              this.maillesPresence++;
              var objet = {
                uuid_base_visit: null,
                id_area: feature.id,
                id_base_visit: null,
                presence: true
              };
              this.dataSend.cor_visit_grid.push(objet);
            } else if (utilise && presence) {
              //present to absent
              layer["setStyle"]({ color: "#FF0000" });
              this.maillesAbsence++;
              this.maillesPresence--;
              this.dataSend.cor_visit_grid[id].presence = false;
            } //absent to pas vu
            else {
              layer["setStyle"]({ color: "#3388ff" });
              this.maillesAbsence--;
              if (this.dataSend.cor_visit_grid.length <= 1) {
                //si y a qu'un element
                this.dataSend.cor_visit_grid.pop();
              } //si y en a plusieurs
              else {
                this.dataSend.cor_visit_grid.splice(id, id + 1);
              }
            }
            console.log(this.dataSend.cor_visit_grid);
            this.maillesNonVisite =
              this.totalMailles - this.maillesAbsence - this.maillesPresence;
          }
        );
      }
    }).addTo(this.map);
    this.map.setView(objet.getBounds().getCenter(), 16);
    document.getElementById("affichChargement").setAttribute("hidden", null);
    this.compteReload = 0;
  }

  //quand on trouve l'utilisateur
  onLocationFound(e) {
    //on supprime le point
    if (this.userPosPoint) {
      this.userPosPoint.remove();
    }
    //on pose un point sur sa position
    this.userPosPoint = L.circleMarker(e["latlng"], {
      color: "#FF8C00",
      fillOpacity: 1,
      radius: 3
    }).addTo(this.map);
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

  CancelVisit() {
    this.router.navigate(["/start-input"]);
  }

  animAffic(reverse: Boolean) {
    if (this.modif >= 25 && !reverse) {
      document.getElementById("affichageNewVisit").style.left =
        this.modif + "%";
      document.getElementById("affichageNewVisit").style.right =
        25 - this.modif + "%";
      this.modif--;
    } else if (this.modif <= 100 && reverse) {
      document.getElementById("affichageNewVisit").style.left =
        this.modif + "%";
      document.getElementById("affichageNewVisit").style.right =
        25 - this.modif + "%";
      this.modif++;
    } else {
      clearInterval(this.eventInterval);
    }
  }

  SubmitVisit() {
    console.log("form:", this.form);
    if (
      this.form.date != "" &&
      this.form.observers.length > 0 &&
      this.maillesNonVisite != this.totalMailles
    ) {
      this.form.perturbations.forEach(element => {
        this.dataSend.cor_visit_perturbation.push(this.perturbations[element]);
      });
      this.form.observers.forEach(element => {
        this.dataSend.cor_visit_observer.push(this.observer[element]);
      });
      this.dataSend.id_base_site = this.id;
      this.dataSend.visit_date_max = this.form.date;
      this.dataSend.visit_date_min = this.form.date;
      this.dataSend.comments = this.form.commentaires;
      //this.dataSend.id_base_visit = null
      //this.dataSend.id_digitiser = null
      //this.dataSend.uuid_base_visit = null
      console.log(this.dataSend);
      this.storage.get("visitsDone").then(res => {
        if (res) {
          res.push(this.dataSend);
          this.storage.set("visitsDone", res).then(x => {
            this.router.navigate(["/home"]);
          });
        } else {
          res = [];
          res.push(this.dataSend);
          this.storage.set("visitsDone", res).then(x => {
            this.router.navigate(["/home"]);
          });
        }
      });
    } else if (this.maillesNonVisite == this.totalMailles) {
      this.alert
        .create({
          header: "Information",
          message: "Vous n'avez pas visité de mailles.",
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
    } else if (this.form.observers.length == 0) {
      this.alert
        .create({
          header: "Information",
          message: "Aucun observateur sélectionné.",
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
    } else if (this.form.date == "") {
      this.alert
        .create({
          header: "Information",
          message: "Vous n'avez pas mis de date.",
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
  }
}
