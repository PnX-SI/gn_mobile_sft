import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NetworkService, ConnectionStatus } from "../services/network.service";
import { ApiService, reponse } from "../services/api.service";
import { Storage } from "@ionic/storage";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  public prev_page: String = "home"; // par défaut, on prévois de renvoyer a home

  public login: String;
  public password: String;

  res;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private networkService: NetworkService,
    private apiService: ApiService,
    private storage: Storage,
    private alert: AlertController
  ) {
    this.route.params.subscribe(params => {
      //console.log(params)
      if (params.back) {
        this.prev_page = params.back;
      }
    });
  }

  ngOnInit() {}

  ionViewDidEnter() //quand on rentre dans la page
  {
    this.storage.get("user").then(val => {
      console.log(val);
      if (val) {
        var today = new Date();
        console.log("today", today.getTime());
        var testeur = Date.parse(val["expires"]);
        console.log("testeur", testeur);

        if (testeur < today.getTime()) {
          this.alert
            .create({
              header: "Information",
              message: "Votre connexion a expiré, veuillez vous reconnecter.",
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
          this.storage.remove("user");
        } else {
          console.log("le token est valide");
          this.router.navigate([this.prev_page]);
        }
      }
    });
  }

  public goToOnline() {
    //au clique du bouton, renvoi a l'ancienne page ou, a défaut, sur home, avec des identifiants
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
    ) {
      this.apiService.LogInAPI(this.login, this.password);
      setTimeout(() => this.tryToLogin(), 100);
    } else {
      document.getElementById("erreur").removeAttribute("hidden");
      document.getElementById("erreur").innerHTML =
        "Vous n'êtes pas connecté à internet";
    }
  }

  public goToOffline() {
    //au clique du bouton, renvoi a l'ancienne page ou, a défaut, sur home
    this.alert
      .create({
        header: "Confirmation requise",
        message: "Voulez-vous utiliser l'application en mode invité ?",
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
              document.getElementById("erreur").setAttribute("hidden", null);
              this.router.navigate([this.prev_page]);
            }
          }
        ]
      })
      .then(alert => {
        alert.present();
      });
  }

  public tryToLogin() {
    this.storage.get("user").then(val => {
      if (val && reponse) {
        console.log("log in");
        console.log(reponse);
        document.getElementById("erreur").setAttribute("hidden", null);
        this.router.navigate([this.prev_page]);
      } else if (!reponse) {
        setTimeout(() => this.tryToLogin(), 100);
      } else {
        this.login = "";
        this.password = "";
        console.error(JSON.stringify(reponse));
        document.getElementById("erreur").removeAttribute("hidden");
        if (!reponse.error.msg) {
          document.getElementById("erreur").innerHTML =
            "une erreur inconnue c'est produite, veuillez réessayer";
        } else {
          document.getElementById("erreur").innerHTML = reponse.error.msg;
        }
      }
    });
  }
}
