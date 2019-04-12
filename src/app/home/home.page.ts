import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	
	donneesStockee = []

	//chargement des imports
	constructor(
		private router:Router,
		private menu: MenuController,
		private storage: Storage
		) 
	{
		for (var i = 0;i <=99;i++)
		{
			this.storage.get("visiteSite"+i).then ((res)=>{
				if(res)
				{
					this.donneesStockee.push(res)
				}
			})
		}
		console.log(this.donneesStockee.length)
	}

	ngOnInit() 
	{
	
	}

	ionViewDidEnter()//quand on rentre dans la page
	{
		//désactivation de tout les menus car pas pertinents
		this.menu.enable(false, "VisuTaxon");
	}

	public goToSetting()
	{
		//au clique du bouton, envoi sur la page setting
		this.router.navigate(['/setting'])
	}
	
	public goToSync()
	{
		//au clique du bouton, envoi sur la page data-sync
		this.router.navigate(['/data-sync']);
	}
	
	public goToInput()
	{
		//au clique du bouton, envoi sur la page start input
		this.router.navigate(['/start-input']);
	}

	public disconnect()
	{
		//au click, enlève de la mémoire de l'appareil l'utilisateur stocké, et ramène au login
		this.storage.remove("token");
		this.router.navigate(['/login',{back:"home"}]);
	}
}
