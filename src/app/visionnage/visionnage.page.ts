import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { Storage } from '@ionic/storage';

import * as L from 'leaflet';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-visionnage',
  templateUrl: './visionnage.page.html',
  styleUrls: ['./visionnage.page.scss'],
})
export class VisionnagePage implements OnInit {
	//variables de la page
	public id;
	map:L.Map;
	data = []
	marque
	nomCommune
	nomTaxon

  	//chargement des imports
	constructor
	(
		private router:Router, 
		private route: ActivatedRoute,
		private apiService: ApiService,
		private storage: Storage
	) 
	{ 
		//on lis les paramêtres qu'on a passé
		this.route.params.subscribe(
			params=>
			{
				this.id = params.id
				this.loadData(true,"visite",this.id);//on charge des données
			});
	}

	loadData(refresh = false,type = "base",id = 0, refresher?) {
		//on part chercher des données dans l'API
		this.apiService.getData(refresh,type,id).subscribe(res => {
		this.data = res;//on fait que la variable exporté soit égale aux données
		  if (refresher) {
			refresher.target.complete();
		  }
		  this.reload()
		});
	  }

	ionViewDidEnter()//quand on rentre dans la page
	{  
		this.storage.get("visiteSite"+this.id).then(res =>{
			if (res)
			{
				alert("Avertisement: Vous avez déjà visité ce site. Enregistrer une visite écrasera l'ancienne.")
			}
		})
		//on fait en sorte que la carte soit affiché
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			// tslint:disable-next-line
			attribution: '&copy; OpenStreetMap',
			maxZoom: 18
		}).addTo(this.map);
   
   
	}

	ngOnInit() //quand on créé la page
	{
		//assiniation de la carte
		this.map = new L.Map('mapVisio');
		//on fait en sorte que la carte ai une échelle (pour se repérer c'est cool)
		L.control.scale("metric").addTo(this.map);
		//on setup ce qu'il se passe si on géolocalise l'utilisateur (on s'en fout de pas le trouver)
		this.map.on('locationfound', (e)=> {this.onLocationFound(e)});
	}
  
	reload()//fonction de (re)chargement
	{
		//on recharge rapidement la carte
		this.map.invalidateSize();
		this.nomCommune = this.data[0]["properties"]["nom_commune"]
		this.nomTaxon = this.data[0]["properties"]["nom_taxon"]
		//on réafirme les paramêtre des marqueurs
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
		//fin réafirmation
		
		//on supprime les marqueurs s'ils existent
		if(this.marque)
		{
			this.marque.remove();
		}

		//on géolocalise un utilisateur
		this.map.locate({
			setView: false, 
			maxZoom: 11
		});	
		
		//on met les données sur la carte
		var objet = L.geoJSON(this.data[0]).addTo(this.map);
		//on centre l'utilisateur sur ce qui l'intéresse
		this.map.setView(objet.getBounds().getCenter(), 16);
  	}	

	GoToNewVisit()
	{
		//on met l'utilisateur sur new visit avec la carte qui correspond
		this.router.navigate(['/new-visit',{id:this.id}]);	 
	}
	
	GoBack()
	{
		//on met l'utilisateur sur start-input
		this.router.navigate(['/start-input']);
	}

	//quand on trouve l'utilisateur
	onLocationFound(e)
	{
		//on pose un marqueur sur sa position
		this.marque = L.marker(e["latlng"],L.Icon.Default).addTo(this.map)
	}
}
