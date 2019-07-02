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
    this.apiService.getData(true).subscribe(res => {
      this.visites = []; //reset pour éviter un faux positif
      res.forEach(element => {
        this.storage.get("visiteSite" + element.id).then(visit => {
          if (visit) {
            this.visites.push(visit);
            //this.local.setListVisit(this.donneesStockee);
          }
        });
      });
    });
    //console.log(this.visites);
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
      "Êtes vous sûr de vouloir supprimer cette visite ?"
    );
    if (confirmation) {
      this.storage.remove("visiteSite" + id);
      this.ionViewDidEnter();
    }
  }

  send(id) {
    var confirmation = confirm(
      "Êtes vous sûr de vouloir envoyer cette visite ?"
    );
    if (confirmation) {
      this.storage.get("visiteSite" + id).then(data => {
        var formatedData = {
          cor_visit_grid: data["cor_visit_grid"],
          id_base_visit: data["id_base_visit"],
          id_base_site: data["id_base_site"],
          cor_visit_perturbation: [], //data["cor_visit_perturbation"][X]["id_nomenclature"]
          comments: data["comments"],
          uuid_base_visit: data["uuid_base_visit"],
          id_digitiser: data["id_digitiser"],
          visit_date_max: data["visit_date_max"],
          cor_visit_observer: [], //data["cor_visit_observer"][X]["id_role"]
          visit_date_min: data["visit_date_min"]
        };
        //on met dans formated data les éléments qui sont trop chiant a passer normalement
        data["cor_visit_perturbation"].forEach(element => {
          //console.log(element);
          formatedData.cor_visit_perturbation.push(element["id_nomenclature"]);
        });
        data["cor_visit_observer"].forEach(element => {
          //console.log(element);
          formatedData.cor_visit_observer.push(element["id_role"]);
        });

        this.storage.get("user").then(user => {
          if (user) {
            if (user["access_token"]) {
              this.apiService.sendData(user["access_token"], formatedData);
            } else {
              console.error("pas de token");
              alert("Veuillez vous connecter à la bonne API.");
            }
          } else {
            var validation = confirm(
              "Vous devez vous authentifier pour envoyer une visite. Voulez-vous vous authentifier ?"
            );
            if (validation) {
              this.router.navigate(["/login", { back: "see-visits" }]);
            }
          }

          setTimeout(() => this.ionViewDidEnter(), 1000);
        });
      });
    }
  }
}
