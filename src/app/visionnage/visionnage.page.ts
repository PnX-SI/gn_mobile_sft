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
  public latitude;
  public longitude;
  marque

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

    var thisLength = data[this.id-1]["geometry"]["coordinates"][0][0].length
    var lonMin = data[this.id-1]["geometry"]["coordinates"][0][0][0][0]
    var lonMax = data[this.id-1]["geometry"]["coordinates"][0][0][thisLength-1][0]
    for (var j=0;j<data[this.id-1]["geometry"]["coordinates"][0][0].length;j++)
    {
      var min = j
      var max = data[this.id-1]["geometry"]["coordinates"][0][0].length-1
      
      for(var h=j+1;h<data[this.id-1]["geometry"]["coordinates"][0][0].length;h++)
      {
        if(data[this.id-1]["geometry"]["coordinates"][0][0][h][0]<data[this.id-1]["geometry"]["coordinates"][0][0][min][0])
        {
          min = h
        }
        else if (data[this.id-1]["geometry"]["coordinates"][0][0][h][0]>data[this.id-1]["geometry"]["coordinates"][0][0][max][0])
        {
          max = h
        }
      }
      if(min != j)
      {
        lonMin = data[this.id-1]["geometry"]["coordinates"][0][0][min][0]
        
      }
      if(max != data[this.id-1]["geometry"]["coordinates"][0][0].length-1)
      {
        lonMax = data[this.id-1]["geometry"]["coordinates"][0][0][max][0]
        
      }
      
    }
    var latMin = data[this.id-1]["geometry"]["coordinates"][0][0][0][1]
    var latMax = data[this.id-1]["geometry"]["coordinates"][0][0][thisLength-1][1]
    for (var j=0;j<data[this.id-1]["geometry"]["coordinates"][0][0].length;j++)
    {
      var min = j
      var max = data[this.id-1]["geometry"]["coordinates"][0][0].length-1
      
      for(var h=j+1;h<data[this.id-1]["geometry"]["coordinates"][0][0].length;h++)
      {
        if(data[this.id-1]["geometry"]["coordinates"][0][0][h][1]<data[this.id-1]["geometry"]["coordinates"][0][0][min][1])
        {
          min = h
        }
        else if (data[this.id-1]["geometry"]["coordinates"][0][0][h][1]>data[this.id-1]["geometry"]["coordinates"][0][0][max][1])
        {
          max = h
        }
      }
      if(min != j)
      {
        latMin = data[this.id-1]["geometry"]["coordinates"][0][0][min][1]
        
      }
      if(max != data[this.id-1]["geometry"]["coordinates"][0][0].length-1)
      {
        latMax = data[this.id-1]["geometry"]["coordinates"][0][0][max][1]
        
      }
      
    }
    this.latitude = (latMin + latMax)/2
    this.longitude =  (lonMin + lonMax)/2
    this.map.setView([this.latitude, this.longitude], 16);		
    if(this.marque)
    {
      this.marque.remove();
    }
    this.map.locate({
			setView: false, 
			maxZoom: 11
      });	
    L.geoJSON(data[this.id-1]).addTo(this.map);
  }	

  GoToNewVisit()
  {
    this.router.navigate(['/new-visit',{id:this.id,latitude:this.latitude,longitude:this.longitude}]);	 
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
