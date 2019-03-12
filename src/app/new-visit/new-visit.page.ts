import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { MenuController } from '@ionic/angular';

import * as L from 'leaflet';

@Component({
  selector: 'app-new-visit',
  templateUrl: './new-visit.page.html',
  styleUrls: ['./new-visit.page.scss'],
})
export class NewVisitPage implements OnInit {

  map:L.Map;

  constructor(
	private router:Router, 
	private route: ActivatedRoute, 
	private menu: MenuController,
	
	) 
  {
	this.route.params.subscribe(params =>{
	  console.log(params);
	})
  }

  ionViewDidEnter()
	{
		this.menu.enable(true, "NewVisit"); 
		this.map.setView([46.52863469527167, 2.43896484375], 18);
					
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				// tslint:disable-next-line
				attribution: '&copy; OpenStreetMap',
				maxZoom: 18
			}).addTo(this.map);
	}

  ngOnInit() 
	{
	this.map = new L.Map('mapVisit');
  }
  
	reload()
	{
		this.map.invalidateSize();
  }	
}
