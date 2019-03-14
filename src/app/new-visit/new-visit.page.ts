import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { MenuController } from '@ionic/angular';

import  {data} from '../app.component'

import * as L from 'leaflet';

@Component({
  selector: 'app-new-visit',
  templateUrl: './new-visit.page.html',
  styleUrls: ['./new-visit.page.scss'],
})
export class NewVisitPage implements OnInit {

	map:L.Map;
	id
	latitude;
	longitude;
	marque

  constructor(
	private router:Router, 
	private route: ActivatedRoute, 
	private menu: MenuController,
	
	) 
  {
		this.route.params.subscribe(params =>{
			//console.log(params);
			this.id = params.id;
			this.latitude = params.latitude;
			this.longitude = params.longitude;

	})
  }

  ionViewDidEnter()
	{	
		this.reload();
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			// tslint:disable-next-line
			attribution: '&copy; OpenStreetMap',
			maxZoom: 18
		}).addTo(this.map);		
	}

  ngOnInit() 
	{
		this.map = new L.Map('mapVisit');
		this.map.on('locationfound', (e)=> {this.onLocationFound(e)});
  }
  
	reload()
	{
		this.map.invalidateSize();
		this.menu.enable(true, "NewVisit");

		const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
		const iconUrl = 'assets/leaflet/marker-icon.png';
		const shadowUrl = 'assets/leaflet/marker-shadow.png';
		const iconDefault = L.icon({
			iconRetinaUrl,
			iconUrl,
			shadowUrl,
			iconSize: [12, 20],
			iconAnchor: [6, 20],
			popupAnchor: [1, -34],
			tooltipAnchor: [16, -28],
			shadowSize: [20, 20]
		});
		L.Marker.prototype.options.icon = iconDefault; 
		
		this.map.setView([this.latitude, this.longitude], 16);
		if(this.marque)
		{
			this.marque.remove()
		}
		this.map.locate({
			setView: false, 
			maxZoom: 11
      });	
		L.geoJSON(data[this.id-1]).addTo(this.map);	
	}	
	
	onLocationFound(e)
  {
    this.marque = L.marker(e["latlng"],L.Icon.Default).addTo(this.map)
  }
}
