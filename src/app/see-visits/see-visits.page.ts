import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-see-visits",
  templateUrl: "./see-visits.page.html",
  styleUrls: ["./see-visits.page.scss"]
})
export class SeeVisitsPage implements OnInit {
  visites = [];

  constructor(
    private router: Router,
    private storage: Storage,
    private apiService: ApiService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() //quand on rentre dans la page
  {
    //récupération du nombre de visites non synchronisées
    this.visites = []; //reset pour éviter un faux positif
    for (var i = 0; i <= 99; i++) {
      this.storage.get("visiteSite" + i).then(res => {
        if (res) {
          this.visites.push(res);
        }
      });
    }
    console.log(this.visites);
  }

  GoToHome() {
    //on envoi l'utilisateur sur la page d'acceuil
    this.router.navigate(["/home"]);
  }

  watch(id) {
    this.router.navigate(["/see-my-visit", { id: id }]);
  }

  delete(id) {
    var confirmation = confirm(
      "êtes vous sûr de vouloir supprimer cette visite?"
    );
    if (confirmation) {
      this.storage.remove("visiteSite" + id);
      this.ionViewDidEnter();
    }
  }

  send(id) {
    var confirmation = confirm(
      "êtes vous sûr de vouloir envoyer cette visite?"
    );
    if (confirmation) {
      this.storage.get("visiteSite" + id).then(data => {
        this.storage.get("user").then(user => {
          if (user["access_token"]) {
            this.apiService.sendData(user["access_token"], data);
            this.ionViewDidEnter();
          } else {
            console.error("pas de token");
          }
        });
      });
    }
  }
}
