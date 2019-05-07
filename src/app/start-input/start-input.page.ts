import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx'


import { ApiService } from '../services/api.service';
import {LocalVariablesService} from '../services/local-variables.service'

import 'leaflet';
import 'leaflet-tilelayer-mbtiles-ts'
import * as geoJSON from 'geojson';
import {NetworkService, ConnectionStatus} from '../services/network.service';

declare var L: any;

@Component({
  selector: 'app-start-input',
  templateUrl: './start-input.page.html',
  styleUrls: ['./start-input.page.scss'],
})


export class StartInputPage implements OnInit {
	//variables de la page
	map:L.Map;
	marque;
	data: geoJSON.FeatureCollection;
	testeur = 0;
	modif = 100;
	eventInterval

	default_Lat = 0
	default_Long = 0
	//chargement des imports
	constructor(
		private menu: MenuController, 
		private router: Router,
		private apiService: ApiService,
		private local: LocalVariablesService,
		private file:File, 
		private networkService: NetworkService
		) 
	{
		this.loadData(true);//on charge des données		
	}

	loadData(refresh = false, refresher?) {
		//on part chercher des données dans l'API
		this.apiService.getData(refresh).subscribe(res => {
		this.data = res;//on fait que la variable exporté soit égale aux données
		  if (refresher) {
			refresher.target.complete();
		  }
		this.reload(); //on appel un chargement de page
		});
	  }

	ionViewDidEnter()//quand on rentre dans la page
	{			
		//on fait en sorte que la carte soit affiché
		this.file.checkFile(this.file.externalDataDirectory+"MBTilesLocales/", this.local.getSettings()["mbTile_File"]).then(res =>{
			//Carte locale (mbTiles)
			this.file.readAsArrayBuffer(this.file.externalDataDirectory+"MBTilesLocales/", this.local.getSettings()["mbTile_File"]).then(res =>{
				console.log("mbtile chargé")
				L.tileLayer.mbTiles(res,{
					maxZoom: 18,
					attribution: "local"
				}).addTo(this.map)
			},err =>{
				console.log("mbtile non chargé")
			})
		}, err =>{
			//Carte online (png via OTM)
			L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
				// tslint:disable-next-line
				attribution: '&copy; OpenTopoMap',
				maxZoom: 18
				}).addTo(this.map);
		})
	}
	
	ngOnInit() //quand on créé la page
	{
		//assiniation de la carte
		this.map = new L.Map('mapProspec');
		//ont met un bouton pour ce recentrer
		var centrer = L.Control.extend({
			options:{
				position:"topleft"
			},
			onAdd: (map)=>{
				var container = L.DomUtil.create('input', 'leaflet-bar leaflet-control leaflet-control-custom');
				container.type = "button"
				container.style["background-image"] = "url(\"../../assets/icon/md-locate.svg\")"
				container.style.backgroundColor = 'white';
				container.style.width = '35px';
				container.style.height = '35px';
			
				container.onclick = function()
				{
					map.locate({
						setView: false, 
						maxZoom: 11
					})
				}
				return container;
			}
		})
		this.map.addControl(new centrer(this.map))
		//on fait en sorte que la carte ai une échelle (pour se repérer c'est cool)
		L.control.scale().addTo(this.map);
		this.default_Lat = this.local.getSettings()['Default_Lat']
		this.default_Long = this.local.getSettings()['Default_Lon']
		console.log("Lat ="+this.default_Lat)
		console.log("lon ="+this.default_Long)
		//on setup ce qu'il se passe quand on tente de géolocaliser l'utilisateur
		this.map.on('locationfound', (e)=> {this.onLocationFound(e)});
		this.map.on('locationerror', (e)=> {this.onLocationError(e)});
		
	}

	ionViewDidLeave()
	{
		//on ferme l'affichage
		document.getElementById('affichageGeneral').style.left = "100%"
			document.getElementById('affichageGeneral').style.right = "-75%"
		this.modif = 100;
	}
	
	reload() //fonction de (re)chargement
	{
		//on montre qu'on charge des truc
		document.getElementById("affichChargement").removeAttribute("hidden");
		//on ferme l'affichage
		clearInterval(this.eventInterval)
		this.eventInterval = setInterval(() => this.animAffic(true),1);
		//on active le bon menu
		this.menu.enable(true, "VisuTaxon");
		//on recharge rapidement la carte
		this.map.invalidateSize();

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
		
		//on géolocalise un utilisateur
		this.map.locate({
			setView: false, 
			maxZoom: 11
		});
		
		//on met les données sur la carte, et on y assigne une fonction
		L.geoJSON(this.data, 
			{
			onEachFeature: (feature, layer) => 
			{
				layer.on("click", () => //au clique, envoi sur la page visionnage qui correspond
				{
					this.router.navigate(['/visionnage',{id:feature.id}]);
				}) 
			} 
		}).addTo(this.map);
		
	}
	
	//quand on trouve l'utilisateur
	onLocationFound(e) {
		this.map.setView(
			/*centre*/[e["latitude"], e["longitude"]],
			/*zoom*/11
			);
		//on supprime les marqueur s'ils existent
		if (this.marque)
		{
			this.marque.remove();
		}
		this.marque = L.marker(e["latlng"]).addTo(this.map); //on place une marque où ce trouve l'utilisateur
		//on indique qu'on a fini de charger
		document.getElementById("affichChargement").setAttribute("hidden",null);
	}
	
	//quand on ne trouve pas l'utilisateur 
	onLocationError(e) {
		console.error(e.message)//on vois le message d'erreur sur la console
		alert(e.message + "\rNous allons afficher la carte par défaut");//on dit pourquoi on l'as pas trouver
		//on met l'utilisateur sur la carte par défaut
		this.map.setView(
		/*centre*/[this.default_Lat, this.default_Long],
		/*zoom*/11
		);
		//on indique qu'on a fini de charger
		document.getElementById("affichChargement").setAttribute("hidden",null);
	}

	GoToHome()
	{
		//on envoi l'utilisateur sur la page d'acceuil
		this.router.navigate(['/home']);
	}

	watchArea(id)
	{
		//au clique du bouton, envoi sur la page visionnage
		this.router.navigate(['/visionnage',{id:id}]);	
	}

	toggleAffichage()
	{
		if (this.modif > 25)
		{
			clearInterval(this.eventInterval)
			this.eventInterval = setInterval(() => this.animAffic(false),1);
		}
		else
		{
			clearInterval(this.eventInterval)
			this.eventInterval = setInterval(() => this.animAffic(true),1);
		}
	}

	animAffic(reverse:Boolean)
	{
		if (this.modif >= 25 && !reverse)
		{
			document.getElementById('affichageGeneral').style.left = this.modif+"%"
			document.getElementById('affichageGeneral').style.right = (25-this.modif)+"%"
			this.modif--
		}
		else if (this.modif <= 100 && reverse)
		{
			document.getElementById('affichageGeneral').style.left = this.modif+"%"
			document.getElementById('affichageGeneral').style.right = (25-this.modif)+"%"
			this.modif++
		}
		else 
		{
			clearInterval(this.eventInterval)
		}
		
	}
}
