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

  totalToSend = 0;

  textResult;

  interval;
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
          "vous n'êtes pas connecter. voulez vous vous connecter?"
        );
        if (validation) {
          this.disableButton = false;
          this.router.navigate(["/login", { back: "data-sync" }]);
        }
      } else {
        this.interval = setInterval(
          () => (this.textResult = resultSilentDataSend),
          100
        );
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
      this.apiService.getLocalData("base").then(res => {
        res.forEach(element => {
          this.storage.remove("visite" + element.id);
          this.storage.remove("maille" + element.id);
        });
        this.storage.remove("base");
      });
      /****************************/
      this.apiService.getData(true, "observeur").subscribe(res => {
        this.apiService.setLocalData("observeur", res);
        this.progressBarRecupdonnee = this.progressBarRecupdonnee + 0.1; //+10% dans la progress bar
      });
      this.apiService.getData(true, "organisme").subscribe(res => {
        this.apiService.setLocalData("organisme", res);
        this.progressBarRecupdonnee = this.progressBarRecupdonnee + 0.1; //+10% dans la progress bar
      });
      this.apiService.getData(true, "perturbations").subscribe(res => {
        this.apiService.setLocalData("perturbations", res);
        this.progressBarRecupdonnee = this.progressBarRecupdonnee + 0.1; //+10% dans la progress bar
      });
      this.apiService.getData(true).subscribe(res => {
        this.apiService.setLocalData("base", res);
        this.progressBarRecupdonnee = this.progressBarRecupdonnee + 0.1; //+10% dans la progress bar
        res.forEach(element => {
          this.apiService
            .getData(true, "visite", element.id)
            .subscribe(elem => {
              this.apiService.setLocalData("visite" + element.id, elem);
              this.progressBarRecupdonnee =
                this.progressBarRecupdonnee + 0.3 / res.length;
            });
        });
        res.forEach(element => {
          this.apiService
            .getData(true, "maille", element.id)
            .subscribe(elem => {
              this.apiService.setLocalData("maille" + element.id, elem);
              this.progressBarRecupdonnee =
                this.progressBarRecupdonnee + 0.3 / res.length;
            });
        });
      });
    } else {
      alert("Vous n'êtes pas connecté a internet.");
    }
  }

  SendVisits() {
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      this.totalToSend = 0; //reset du compte de données a envoyer
      this.progressBarEnvoyee = 0; //reset la progress bar
      this.apiService.PurgeresultSilentDataSend();
      this.storage.get("user").then(user => {
        if (user["access_token"]) {
          //on s'assure que l'utilisateur est connecté à une api qui utilise le jwt
          for (var i = 0; i <= 99; i++) {
            this.storage.get("visiteSite" + i).then(data => {
              //pour un grand nombre de donnée
              if (data) {
                // si la donnée existe
                this.totalToSend++;
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
                  this.progressBarEnvoyee + 1 / this.totalToSend;
              }
            });
          }
        } else {
          console.error("pas de token");
          alert("veuillez vous connecter à la bonne api");
        }
      });
    } else {
      alert("Vous n'êtes pas connecté a internet.");
    }
  }

  goToHome() {
    this.router.navigate(["/home"]);
  }

  ionViewDidLeave() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
