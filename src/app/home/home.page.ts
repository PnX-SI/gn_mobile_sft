import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	
	//chargement des imports
	constructor(
		private router:Router,
		private menu: MenuController
		) 
	{
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
		this.router.navigate(['/data-sync'])
	}
	
	public goToInput()
	{
		//au clique du bouton, envoi sur la page start input
		this.router.navigate(['/start-input'])
	}
}
