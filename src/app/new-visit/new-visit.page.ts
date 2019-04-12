import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import { ApiService } from '../services/api.service';

import * as L from 'leaflet';


@Component({
  selector: 'app-new-visit',
  templateUrl: './new-visit.page.html',
  styleUrls: ['./new-visit.page.scss'],
})

export class NewVisitPage implements OnInit {
	//variables de la page
	map:L.Map;
	id
	marque
	visite = []
	mailles = []
	observer = []
	perturbations = []
	compteReload = 0
	modif = 100;
	eventInterval

	dataSend = {}
	
	//chargement des imports
	constructor(
			private router:Router, 
			private route: ActivatedRoute,
			private apiService: ApiService
		) 
	{
		//on lis les paramêtres qu'on a passé
		this.route.params.subscribe(params =>{
			this.id = params.id;
			
		});
		//on call une lecture de données
		this.loadDataVisite(true,"visite",this.id)
		this.loadDataMailles(true, "maille",this.id);
		this.loadDataObserver(true, "observeur",this.id);
		this.loadDataPerturbations(true, "perturbations",this.id);
	}
	
	/*fonctions de lecture de données*/
	loadDataVisite(refresh = false,type = "base",id = 0, refresher?) {
		this.apiService.getData(refresh,type,id).subscribe(res => {
			this.visite = res[0];
			console.log("visite:");
			console.log(res[0]);
			if (refresher) {
        		refresher.target.complete();
      		}
		});
	 }
	loadDataMailles(refresh = false,type = "base",id = 0, refresher?) {
		this.apiService.getData(refresh,type,id).subscribe(res => {
			this.mailles = res;
			console.log("mailles:");
			console.log(res);
			if (refresher) {
        		refresher.target.complete();
      		}
		});
	 }
	 loadDataObserver(refresh = false,type = "base",id = 0, refresher?) {
		this.apiService.getData(refresh,type,id).subscribe(res => {
			this.observer = res[0];
			console.log("observers:");
			console.log(res[0]);
			if (refresher) {
        		refresher.target.complete();
      		}
		});
	 }
	 loadDataPerturbations(refresh = false,type = "base",id = 0, refresher?) {
		this.apiService.getData(refresh,type,id).subscribe(res => {
			this.perturbations = res;
			console.log("perturbations:");
			console.log(res);
			if (refresher) {
        		refresher.target.complete();
      		}
		});
	 }
	 /*****************************/

  	ionViewDidEnter()//quand on rentre dans la page
	{	
		//on montre qu'on charge des truc
		document.getElementById("affichChargement").removeAttribute("hidden");
		setTimeout(() => this.reload(),100); //on appel un chargement de page
		//on fait en sorte que la carte soit affiché
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			// tslint:disable-next-line
			attribution: '&copy; OpenStreetMap',
			maxZoom: 18
		}).addTo(this.map);	
		
	}

  	ngOnInit()  //quand on créé la page
	{
		//assignation de la carte
		this.map = new L.Map('mapVisit');
		//on fait en sorte que la carte ai une échelle (pour se repérer c'est cool)
		L.control.scale("metric").addTo(this.map);
		//on setup ce qu'il se passe si on géolocalise l'utilisateur (on s'en fout de pas le trouver)	
		this.map.on('locationfound', (e)=> {this.onLocationFound(e)});
		
	}
	
	ionViewDidLeave()
	{
		//on ferme l'affichage
		document.getElementById('affichage').style.left = "100%"
		document.getElementById('affichage').style.right = "-75%"
		this.modif = 100;
	}
  
	reload()//fonction de (re)chargement
	{
		
		//on montre qu'on charge des truc
		document.getElementById("affichChargement").removeAttribute("hidden");
		//on ferme l'affichage
		clearInterval(this.eventInterval)
		this.eventInterval = setInterval(() => this.animAffic(true),1);
		//on recharge rapidement la carte
		this.map.invalidateSize();

		//on réafirme les paramêtre des marqueurs, et on change leur taille (pour simplifier la vie de l'utilisateur)
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
		//fin réafirmation
		
		//on supprime les marqueurs s'ils existent
		if(this.marque)
		{
			this.marque.remove()
		}

		//on géolocalise un utilisateur
		this.map.locate({
			setView: false, 
			maxZoom: 11
		});
		
		
		if(this.mailles.length >0)//si la donnée a pu se charger
		{
			var objet = L.geoJSON(this.mailles,{
				onEachFeature: (feature, layer) => 
				{
					layer.on("click", () => //au clique, envoi sur la page visionnage qui correspond
					{
						console.log(feature.id);
						if(layer.options.color.valueOf() == "#3388ff")
						{
							layer.setStyle({color:"#00FF00"});
						}
						else if (layer.options.color.valueOf() =="#00FF00")
						{
							layer.setStyle({color:"#FF0000"});
						}
						else
						{
							layer.setStyle({color:"#3388ff"});
						}
					}) 
				} 
			}).addTo(this.map);	
			this.map.setView(objet.getBounds().getCenter(), 16);
			document.getElementById("affichChargement").setAttribute("hidden",null);
			this.compteReload = 0;
		}
		else if (this.compteReload < 10)//sinon, on demande a recharger jusqu'à X fois
		{
			this.compteReload ++;
			setTimeout(() => this.reload(),100); 
		}
		else//Si ça répond pas au bout des X fois
		{
			alert ("nous n'avons pas réussi a récupérer les données. Veuillez appuyer sur le bouton de rafraichissement.")
			document.getElementById("affichChargement").setAttribute("hidden",null);
			this.compteReload = 0;
		}
	}	
	
	//quand on trouve l'utilisateur
	onLocationFound(e)
	{
		//on pose un marqueur sur sa position
		this.marque = L.marker(e["latlng"],L.Icon.Default).addTo(this.map)
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

	CancelVisit()
	{
		// TODO:code pour annuler la saisie
		this.router.navigate(['/start-input']);
	}	
	 
	animAffic(reverse:Boolean)
	{
		if (this.modif >= 25 && !reverse)
		{
			document.getElementById('affichage').style.left = this.modif+"%"
			document.getElementById('affichage').style.right = (25-this.modif)+"%"
			this.modif--
		}
		else if (this.modif <= 100 && reverse)
		{
			document.getElementById('affichage').style.left = this.modif+"%"
			document.getElementById('affichage').style.right = (25-this.modif)+"%"
			this.modif++
		}
		else 
		{
			clearInterval(this.eventInterval)
		}
		
	}

	SubmitVisit()
	{
		//TODO: Fout les données dans this.dataSend
		console.log("pas encore géré")
		//this.apiService.setLocalData("visiteSite"+this.id,this.dataSend);
		this.router.navigate(['/start-input']);
	}
	
}
