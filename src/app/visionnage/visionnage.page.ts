import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { MenuController } from '@ionic/angular';

import  {data} from '../app.component'

import * as L from 'leaflet';

@Component({
  selector: 'app-visionnage',
  templateUrl: './visionnage.page.html',
  styleUrls: ['./visionnage.page.scss'],
})
export class VisionnagePage implements OnInit {

  public id;
  map:L.Map;
  marque
  objet = []

  constructor
  (
    private router:Router, 
    private route: ActivatedRoute,
    private menu: MenuController
  ) 
  { 
    this.route.params.subscribe(
      params=>
      {
        //console.log(params);
        this.id = params.id
        this.objet = data[this.id-1]
      });
  }
  ionViewDidEnter()
	{  
    this.reload()
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // tslint:disable-next-line
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18
    }).addTo(this.map);
   
	}

  ngOnInit() 
	{
    this.map = new L.Map('mapVisio');
    this.map.on('locationfound', (e)=> {this.onLocationFound(e)});
  }
  
	reload()
	{
    this.map.invalidateSize();
    this.menu.enable(false, "NewVisit");
    this.menu.enable(false, "VisuTaxon");
    
    const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
    const iconUrl = 'assets/leaflet/marker-icon.png';
    const shadowUrl = 'assets/leaflet/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;	
    if(this.marque)
    {
      this.marque.remove();
    }
    this.map.locate({
			setView: false, 
			maxZoom: 11
      });	
    var objet = L.geoJSON(data[this.id-1]).addTo(this.map);
    this.map.setView(objet.getBounds().getCenter(), 16);
  }	

  GoToNewVisit()
  {
    this.router.navigate(['/new-visit',{id:this.id}]);	 
  }
  GoBack()
  {
    this.router.navigate(['/start-input']);
  }

  onLocationFound(e)
  {
    this.marque = L.marker(e["latlng"],L.Icon.Default).addTo(this.map)
  }
}
