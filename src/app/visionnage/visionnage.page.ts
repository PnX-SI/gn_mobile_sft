import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

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

  constructor
  (
    private router:Router, 
	  private route: ActivatedRoute
  ) 
  { 
    this.route.params.subscribe(
      params=>
      {
        console.log(params);
        this.id = params.id
      });
  }
  ionViewDidEnter()
	{ 
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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // tslint:disable-next-line
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18
    }).addTo(this.map);
    L.geoJSON(data[this.id-1]).addTo(this.map);
	}

  ngOnInit() 
	{
	this.map = new L.Map('mapVisio');
  }
  
	reload()
	{
		this.map.invalidateSize();
  }	

  GoToNewVisit()
  {
    this.router.navigate(['/new-visit',{id:this.id,latitude:this.latitude,longitude:this.longitude}]);	 
  }
}
