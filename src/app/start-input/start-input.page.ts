import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-start-input',
  templateUrl: './start-input.page.html',
  styleUrls: ['./start-input.page.scss'],
})
export class StartInputPage implements OnInit {
	
	map:L.Map;
	
	constructor() { }

	ngOnInit() 
	{
		this.map = new L.Map('map', {
		center:[46.52863469527167, 2.43896484375],
		zoom: 6
		});
		
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		   // tslint:disable-next-line
		  attribution: '&copy; OpenStreetMap',
		  maxZoom: 18
		}).addTo(this.map);
	}

}
