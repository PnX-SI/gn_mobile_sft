import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { ApiService } from "../services/api.service";
import { AlertController } from "@ionic/angular";

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
    private apiService: ApiService,
    private alert: AlertController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() //quand on rentre dans la page
  {
    //récupération du nombre de visites non synchronisées
    this.storage.get("visitsDone").then(res => {
      this.visites = res;
    });
  }

  GoToHome() {
    //on envoi l'utilisateur sur la page d'acceuil
    this.router.navigate(["/home"]);
  }

  watch(id) {
    this.router.navigate(["/see-my-visit", { id: id }]);
  }

  delete(id) {
    this.alert
      .create({
        header: "Confirmation requise",
        message: "Êtes vous sûr de vouloir supprimer cette visite ?",
        buttons: [
          {
            text: "Non",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              console.log("non");
            }
          },
          {
            text: "Oui",
            handler: () => {
              console.log("oui");
              this.storage.get("visitsDone").then(res => {
                if (res) {
                  res.splice(id, 1);
                  this.storage.set("visitsDone", res).then(x => {
                    this.ionViewDidEnter();
                  });
                }
              });
            }
          }
        ]
      })
      .then(alert => {
        alert.present();
      });
  }

  send(id) {
    this.alert
      .create({
        header: "Confirmation requise",
        message: "Êtes vous sûr de vouloir envoyer cette visite ?",
        buttons: [
          {
            text: "Non",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              console.log("non");
            }
          },
          {
            text: "Oui",
            handler: () => {
              console.log("oui");
              this.storage.get("visitsDone").then(data => {
                data = data[id];

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
                  formatedData.cor_visit_perturbation.push(
                    element["id_nomenclature"]
                  );
                });
                data["cor_visit_observer"].forEach(element => {
                  //console.log(element);
                  formatedData.cor_visit_observer.push(element["id_role"]);
                });

                this.storage.get("user").then(user => {
                  if (user) {
                    if (user["access_token"]) {
                      this.apiService.sendData(
                        user["access_token"],
                        formatedData,
                        id
                      );
                    } else {
                      console.error("pas de token");
                      this.alert
                        .create({
                          header: "Avertissement",
                          message: "Veuillez vous connecter à la bonne API.",
                          buttons: [
                            {
                              text: "Ok",
                              handler: () => {}
                            }
                          ]
                        })
                        .then(averter => {
                          averter.present();
                        });
                    }
                  } else {
                    this.alert
                      .create({
                        header: "Confirmation requise",
                        message:
                          "Vous devez vous authentifier pour envoyer une visite. Voulez-vous vous authentifier ?",
                        buttons: [
                          {
                            text: "Non",
                            role: "cancel",
                            cssClass: "secondary",
                            handler: () => {
                              console.log("non");
                            }
                          },
                          {
                            text: "Oui",
                            handler: () => {
                              console.log("oui");
                              this.router.navigate([
                                "/login",
                                { back: "see-visits" }
                              ]);
                            }
                          }
                        ]
                      })
                      .then(alert => {
                        alert.present();
                      });
                  }

                  setTimeout(() => this.ionViewDidEnter(), 1000);
                });
              });
            }
          }
        ]
      })
      .then(alert => {
        alert.present();
      });
  }
}
