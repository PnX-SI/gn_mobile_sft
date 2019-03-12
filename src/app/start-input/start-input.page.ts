import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

import * as L from 'leaflet';

import  {data} from '../app.component'

@Component({
  selector: 'app-start-input',
  templateUrl: './start-input.page.html',
  styleUrls: ['./start-input.page.scss'],
})
export class StartInputPage implements OnInit {
	
	map:L.Map;

	constructor(
		private menu: MenuController, 
		private router: Router
		) 
	{
		
	}

	ionViewDidEnter()
	{
		this.menu.enable(true, "VisuTaxon");
		this.map.locate({
		setView: true, 
		maxZoom: 11
		});
				
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		   // tslint:disable-next-line
		  attribution: '&copy; OpenStreetMap',
		  maxZoom: 18
		}).addTo(this.map);

		L.geoJSON(data).addTo(this.map);

		this.map.on('locationfound', (e)=> {this.onLocationFound(e)});
		this.map.on('locationerror', (e)=> {this.onLocationError(e)});
		

	}
	
	ngOnInit() 
	{
		this.map = new L.Map('mapProspec');
	}
	
	reload()
	{
		this.map.invalidateSize();
		this.menu.enable(true, "VisuTaxon");
	}
	
	onLocationFound(e) {
		console.log("localisation trouvée");
		this.map.setZoom(15);
	}
	
	onLocationError(e) {
		console.error(e.message)
		alert(e.message + "\rWe'll show default map");
		this.map.setView(
		/*centre*/[46.52863469527167, 2.43896484375],
		/*zoom*/6
		);
	}

	GoToHome()
	{
		this.router.navigate(['/home']);
	}
}
