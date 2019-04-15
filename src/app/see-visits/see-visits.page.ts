import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-see-visits',
  templateUrl: './see-visits.page.html',
  styleUrls: ['./see-visits.page.scss'],
})
export class SeeVisitsPage implements OnInit {

  visites = []

  constructor
  (
    private router: Router,
    private storage: Storage
  ) 
  { 

  }

  ngOnInit() 
  {

  }

  ionViewDidEnter()//quand on rentre dans la page
	{
		//récupération du nombre de visites non synchronisées
		this.visites = [] //reset pour éviter un faux positif
		for (var i = 0;i <=99;i++)
		{
			this.storage.get("visiteSite"+i).then ((res)=>{
				if(res)
				{
					this.visites.push(res)
				}
			})
		}
		console.log(this.visites)
  }
  
  GoToHome()
	{
		//on envoi l'utilisateur sur la page d'acceuil
		this.router.navigate(['/home']);
  }
  
  watch(id)
  {
    this.router.navigate(['/see-my-visit',{id:id}]);
  }

  delete(id)
  {
    var confirmation = confirm("êtes vous sûr de vouloir supprimer cette visite?")
    if(confirmation)
    {
      this.storage.remove("visiteSite"+id)
      this.ionViewDidEnter()
    }
  }
}
