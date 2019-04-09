import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {SessionService} from '../services/session.service';
import { NetworkService, ConnectionStatus } from '../services/network.service';
import {ApiService} from '../services/api.service'
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public prev_page: String = "home"; // par défaut, on prévois de renvoyer a home

  public login: String;
  public password: String;

  public essai = 0;
  constructor
  (
    private router:Router,
    private route:ActivatedRoute,
    private session: SessionService,
    private networkService: NetworkService, 
    private apiService: ApiService
  ) 
  {
    this.route.params.subscribe(params =>{
      //console.log(params)
      if (params.back){
        this.prev_page = params.back;
      }
    })
  }

  ngOnInit() {
  }

  ionViewDidEnter()//quand on rentre dans la page
  {

  }

  public async goToOnline()
	{
    //au clique du bouton, renvoi a l'ancienne page ou, a défaut, sur home, avec des identifiants
    if(this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online)
    {
      //TODO: faire que ça marche       
      var token = this.apiService.LogInAPI(this.login,this.password)
      console.log(token)
      this.session.setToken(token);
      if(this.session.getToken())
      {
        document.getElementById("erreur").setAttribute("hidden",null);
        //this.router.navigate([this.prev_page]);
        console.log("ça marche")
      }
      else
      {
        this.login = "";
        this.password = "";
        document.getElementById("erreur").removeAttribute("hidden");
        document.getElementById("erreur").innerHTML = "login ou password invalide";
      }  

    }
    else
    {
      document.getElementById("erreur").removeAttribute("hidden");
      document.getElementById("erreur").innerHTML = "Vous n'êtes pas connecté a internet";
    }
        
  }
  
  public goToOffline()
	{
		//au clique du bouton, renvoi a l'ancienne page ou, a défaut, sur home
    var confirmation = confirm("voulez vous utiliser l'application en mode hors ligne?")
    if (confirmation)
    {
      document.getElementById("erreur").setAttribute("hidden",null);
      this.router.navigate([this.prev_page])
    }
	}
}
