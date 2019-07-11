import { Component, OnInit } from "@angular/core";
import { ApiService, resultSilentDataSend } from "../services/api.service";
import { NetworkService, ConnectionStatus } from "../services/network.service";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";

@Component({
  selector: "app-data-sync",
  templateUrl: "./data-sync.page.html",
  styleUrls: ["./data-sync.page.scss"]
})
export class DataSyncPage implements OnInit {
  progressBarRecupdonnee = 0;
  progressBarEnvoyee = 0;
  disableButton = false;

  textResult;

  isLocalDataUpdated = false;
  isDataSend = false;

  interval = [];
  constructor(
    private networkService: NetworkService,
    private apiService: ApiService,
    private storage: Storage,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.storage.get("user").then(res => {
      if (!res) {
        this.disableButton = true;
        var validation = confirm(
          "Vous n'êtes pas authentifié. Voulez-vous vous authentifier ?"
        );
        if (validation) {
          this.disableButton = false;
          this.router.navigate(["/login", { back: "data-sync" }]);
        }
      } else {
        this.interval[0] = setInterval(
          () => (this.textResult = resultSilentDataSend),
          100
        );
        this.interval[1] = setInterval(() => {
          if (this.progressBarRecupdonnee >= 0.9) {
            //on attend que les données soit récupéré
            this.isLocalDataUpdated = true; //on dit que cette partie est synchronisé
            //console.log("sync get");
          } else {
            this.isLocalDataUpdated = false;
          }
        }, 100);
        this.interval[2] = setInterval(() => {
          if (this.progressBarEnvoyee >= 0.9) {
            //on attend que les données soit envoyé
            this.isDataSend = true; //on dit que cette partie est synchronisé
            //console.log("sync send");
          } else {
            this.isDataSend = false;
          }
        }, 100);
        this.interval[3] = setInterval(() => {
          if (this.isDataSend && this.isLocalDataUpdated) {
            //quand tout est synchronisé
            console.log("synchronisé");
            this.storage.set("timestampSynchro", Date.now()); //on stocke le moment où ça a été synchronisé
            clearInterval(this.interval[3]);
          }
        }, 100);
      }
    });
  }

  SaveToLocalData() {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      this.progressBarRecupdonnee = 0; //reset la progress bar
      /*purge des anciennes données*/
      this.storage.remove("observeur");
      this.storage.remove("perturbations");
      this.storage.remove("organisme");
      this.storage.get("base").then(res => {
        res.forEach(element => {
          this.storage.remove("visite" + element.id);
          this.storage.remove("maille" + element.id);
        });
        this.storage.remove("base");
      });
      /****************************/
      this.apiService.getData(true, "observeur").subscribe(res => {
        this.storage.set("observeur", res);
        this.progressBarRecupdonnee = this.progressBarRecupdonnee + 0.1; //+10% dans la progress bar
      });
      this.apiService.getData(true, "organisme").subscribe(res => {
        this.storage.set("organisme", res);
        this.progressBarRecupdonnee = this.progressBarRecupdonnee + 0.1; //+10% dans la progress bar
      });
      this.apiService.getData(true, "perturbations").subscribe(res => {
        this.storage.set("perturbations", res);
        this.progressBarRecupdonnee = this.progressBarRecupdonnee + 0.1; //+10% dans la progress bar
      });
      this.apiService.getData(true).subscribe(res => {
        this.storage.set("base", res);
        this.progressBarRecupdonnee = this.progressBarRecupdonnee + 0.1; //+10% dans la progress bar
        res.forEach(element => {
          this.apiService
            .getData(true, "visite", element.id)
            .subscribe(elem => {
              this.storage.set("visite" + element.id, elem);
              this.progressBarRecupdonnee =
                this.progressBarRecupdonnee + 0.3 / res.length;
            });
        });
        res.forEach(element => {
          this.apiService
            .getData(true, "maille", element.id)
            .subscribe(elem => {
              this.storage.set("maille" + element.id, elem);
              this.progressBarRecupdonnee =
                this.progressBarRecupdonnee + 0.3 / res.length;
            });
        });
      });
    } else {
      alert("Vous n'êtes pas connecté à internet.");
    }
  }

  SendVisits() {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      this.progressBarEnvoyee = 0; //reset la progress bar
      this.apiService.PurgeresultSilentDataSend();
      this.storage.get("user").then(user => {
        if (user["access_token"]) {
          //on s'assure que l'utilisateur est connecté à une api qui utilise le jwt
          this.storage.get("visitsDone").then(res => {
            if (res) {
              for (var i = 0; i < res.length; i++) {
                var data = res[i];
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

                this.apiService.SilentSendData(
                  user["access_token"],
                  formatedData
                );
                this.progressBarEnvoyee =
                  this.progressBarEnvoyee + 1 / res.length;
              }
            }
          });
        } else {
          console.error("pas de token");
          alert("Veuillez vous connecter à la bonne API.");
        }
      });
    } else {
      alert("Vous n'êtes pas connecté à internet.");
    }
  }

  goToHome() {
    this.router.navigate(["/home"]);
  }

  syncAll() {
    this.SendVisits();
    this.SaveToLocalData();
  }

  ionViewDidLeave() {
    if (this.interval.length > 0) {
      clearInterval(this.interval[0]);
      clearInterval(this.interval[1]);
      clearInterval(this.interval[2]);
    }
  }
}
