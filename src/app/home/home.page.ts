import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { LocalVariablesService } from "../services/local-variables.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  donneesStockee = [];
  lastSync;

  //chargement des imports
  constructor(
    private router: Router,
    private storage: Storage,
    private local: LocalVariablesService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() //quand on rentre dans la page
  {
    //indication de la dernière synchro
    if (!this.local.getSettings()["seeSetting"]) {
      document.getElementById("settings").setAttribute("hidden", null);
    }
    this.storage.get("timestampSynchro").then(res => {
      if (res) {
        var temps = new Date();
        temps.setTime(res);
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
        this.lastSync = dateEcrit;
      } else {
        this.lastSync = "Jamais";
      }
    });

    //récupération du nombre de visites non synchronisées
    this.storage.get("visitsDone").then(res => {
      if (res) {
        this.donneesStockee = res;
      } else {
        this.donneesStockee = [];
      }
    });
  }

  public goToSetting() {
    //au clique du bouton, envoi sur la page setting
    this.router.navigate(["/setting"]);
  }

  public goToSync() {
    //au clique du bouton, envoi sur la page data-sync
    this.router.navigate(["/data-sync"]);
  }

  public goToInput() {
    //au clique du bouton, envoi sur la page start input
    this.router.navigate(["/start-input"]);
  }

  public goToWatch() {
    this.router.navigate(["/see-visits"]);
  }

  public disconnect() {
    //au click, enlève de la mémoire de l'appareil l'utilisateur stocké, et ramène au login
    this.storage.remove("user");
    this.router.navigate(["/login", { back: "home" }]);
  }
}
