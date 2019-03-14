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
	marque

	constructor(
		private menu: MenuController, 
		private router: Router,
		) 
	{
		
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
		this.map = new L.Map('mapProspec');
		this.map.on('locationfound', (e)=> {this.onLocationFound(e)});
		this.map.on('locationerror', (e)=> {this.onLocationError(e)});
	}
	
	reload()
	{
		document.getElementById("affichChargement").removeAttribute("hidden");
		this.menu.enable(true, "VisuTaxon");
		this.map.invalidateSize();

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
		
		if (this.marque)
		{
			this.marque.remove();
		}
		this.map.locate({
			setView: false, 
			maxZoom: 11
			});
		L.geoJSON(data).addTo(this.map);
		document.getElementById("affichChargement").setAttribute("hidden",null);
	}
	
	onLocationFound(e) {
		var confirmation = confirm("Vous avez été géolocaliser.\rVoulez vous que l'appli vérifie si vous êtes a proximité d'un lieu a visiter? (cela peut prendre du temps)")
		if(confirmation)
		{
			var identifiant = NaN
			document.getElementById("affichChargement").removeAttribute("hidden");
			for (var i=0;i<data.length;i++)
			{
				var thisLength = data[i]["geometry"]["coordinates"][0][0].length
				var lonMin = data[i]["geometry"]["coordinates"][0][0][0][0]
				var lonMax = data[i]["geometry"]["coordinates"][0][0][thisLength-1][0]
				for (var j=0;j<data[i]["geometry"]["coordinates"][0][0].length;j++)
				{
					var min = j
					var max = data[i]["geometry"]["coordinates"][0][0].length-1
					
					for(var h=j+1;h<data[i]["geometry"]["coordinates"][0][0].length;h++)
					{
						if(data[i]["geometry"]["coordinates"][0][0][h][0]<data[i]["geometry"]["coordinates"][0][0][min][0])
						{
							min = h
						}
						else if (data[i]["geometry"]["coordinates"][0][0][h][0]>data[i]["geometry"]["coordinates"][0][0][max][0])
						{
							max = h
						}
					}
					if(min != j)
					{
						lonMin = data[i]["geometry"]["coordinates"][0][0][min][0]
						
					}
					if(max != data[i]["geometry"]["coordinates"][0][0].length-1)
					{
						lonMax = data[i]["geometry"]["coordinates"][0][0][max][0]
						
					}
					
				}
				var latMin = data[i]["geometry"]["coordinates"][0][0][0][1]
				var latMax = data[i]["geometry"]["coordinates"][0][0][thisLength-1][1]
				for (var j=0;j<data[i]["geometry"]["coordinates"][0][0].length;j++)
				{
					var min = j
					var max = data[i]["geometry"]["coordinates"][0][0].length-1
					
					for(var h=j+1;h<data[i]["geometry"]["coordinates"][0][0].length;h++)
					{
						if(data[i]["geometry"]["coordinates"][0][0][h][1]<data[i]["geometry"]["coordinates"][0][0][min][1])
						{
							min = h
						}
						else if (data[i]["geometry"]["coordinates"][0][0][h][1]>data[i]["geometry"]["coordinates"][0][0][max][1])
						{
							max = h
						}
					}
					if(min != j)
					{
						latMin = data[i]["geometry"]["coordinates"][0][0][min][1]
						
					}
					if(max != data[i]["geometry"]["coordinates"][0][0].length-1)
					{
						latMax = data[i]["geometry"]["coordinates"][0][0][max][1]
						
					}
					
				}
				if (lonMin <= e["longitude"] && e["longitude"]<=lonMax && latMin <= e["latitude"] && e["latitude"] <= latMax)
					{
						identifiant = data[i]["id"];
						break
					}
			}
			document.getElementById("affichChargement").setAttribute("hidden",null);
			/*//outil de débug
			//décommantez si vous voulez vérifier que la redirection ce fait bien
			var debug = confirm("Debug?")
			if(debug)
			{
				identifiant = parseInt(prompt("entrez un idendifiant", "2"));
			}*/
			

			if (identifiant)
			{
				alert("Nous avons trouvé une zone a visualiser autour de vous.\rRedirection.")
				this.map.setView(
					/*centre*/[e["latitude"], e["longitude"]],
					/*zoom*/11
					);
				this.router.navigate(['/visionnage',{id:identifiant}]);	
			}
			else
			{
				alert("Nous n'avons pas trouvé de zone a visualiser autour de vous.\rNous allons afficher les environs autour de vous")
				this.map.setView(
					/*centre*/[e["latitude"], e["longitude"]],
					/*zoom*/11
					);
			}
		}
		else
		{
			alert("Nous allons afficher les environs autour de vous")
			this.map.setView(
				/*centre*/[e["latitude"], e["longitude"]],
				/*zoom*/11
				);
		}
		this.marque = L.marker(e["latlng"],L.Icon.Default).addTo(this.map);

	}
	
	onLocationError(e) {
		console.error(e.message)
		alert(e.message + "\rNous allons afficher la carte par défaut");
		this.map.setView(
		/*centre*/[44.5682846, 6.0634622],
		/*zoom*/11
		);
	}

	GoToHome()
	{
		this.router.navigate(['/home']);
	}
}
