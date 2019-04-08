import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {SessionService} from '../services/session.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public prev_page: String = "home"; // par défaut, on prévois de renvoyer a home

  constructor
  (
    private router:Router,
    private route:ActivatedRoute,
    private session: SessionService
  ) 
  {
    this.route.params.subscribe(params =>{
      console.log(params)
      if (params.back){
        this.prev_page = params.back;
      }
    })
  }

  ngOnInit() {
  }

  public goToOnline()
	{
    //au clique du bouton, renvoi a l'ancienne page ou, a défaut, sur home, avec des identifiants
    if(true)
    {
      this.session.setLogin(document.getElementById("login").innerHTML);
      this.session.setPassword(document.getElementById("password").innerHTML);
      this.router.navigate([this.prev_page]);
      document.getElementById("erreur").setAttribute("hidden",null);
    }
    else
    {
      document.getElementById("erreur").removeAttribute("hidden");
    }
    
  }
  
  public goToOffline()
	{
		//au clique du bouton, renvoi a l'ancienne page ou, a défaut, sur home
    var confirmation = confirm("voulez vous utiliser l'application en mode hors ligne?")
    if (confirmation)
    {
      this.router.navigate([this.prev_page])
    }
	}
}
