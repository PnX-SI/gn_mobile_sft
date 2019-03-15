import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { MenuController } from '@ionic/angular';

import { ApiService } from '../services/api.service';

import * as L from 'leaflet';
import { delay } from 'q';

@Component({
  selector: 'app-new-visit',
  templateUrl: './new-visit.page.html',
  styleUrls: ['./new-visit.page.scss'],
})
export class NewVisitPage implements OnInit {

	map:L.Map;
	id
	marque
	data = []

  constructor(
		private router:Router, 
		private route: ActivatedRoute, 
		private menu: MenuController,
		private apiService: ApiService
	) 
  {
		this.route.params.subscribe(params =>{
			//console.log(params);
			this.id = params.id;
			
		});
		 this.loadData(true, "maille",this.id);
	}
	
	loadData(refresh = false,type = "base",id = 0, refresher?) {
		this.apiService.getData(refresh,type,id).subscribe(res => {
			this.data = res;
			if (refresher) {
        refresher.target.complete();
      }
			});
  }

  ionViewDidEnter()
	{	
		
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			// tslint:disable-next-line
			attribution: '&copy; OpenStreetMap',
			maxZoom: 18
		}).addTo(this.map);	
		
	}

  ngOnInit() 
	{

		this.map = new L.Map('mapVisit');
		L.control.scale("metric").addTo(this.map);	
		this.map.on('locationfound', (e)=> {this.onLocationFound(e)});
		setTimeout(() => this.reload(),1000) ;
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
		
		if(this.marque)
		{
			this.marque.remove()
		}
		this.map.locate({
			setView: false, 
			maxZoom: 11
			});	
		if(this.data.length >0)
		{
			var objet = L.geoJSON(this.data).addTo(this.map);	
			this.map.setView(objet.getBounds().getCenter(), 16);
		}
		else
		{
			alert ("nous n'avons pas réussi a récupérer les données. Veuillez appuyer sur le bouton de rafraichissement.")
		}
	}	
	
	onLocationFound(e)
  {
    this.marque = L.marker(e["latlng"],L.Icon.Default).addTo(this.map)
  }
}
