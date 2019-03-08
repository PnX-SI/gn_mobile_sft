import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	constructor(
		private router:Router,
		private menu: MenuController
		) 
	{
	}

	ngOnInit() 
	{
	
	}

	ionViewDidEnter()
	{
		this.menu.enable(false, "NewVisit");
		this.menu.enable(false, "VisuTaxon");
	}

	public goToSetting()
	{
		this.router.navigate(['/setting'])
	}
	
	public goToSync()
	{
		this.router.navigate(['/data-sync'])
	}
	
	public goToInput()
	{
		this.router.navigate(['/start-input'])
	}
}
