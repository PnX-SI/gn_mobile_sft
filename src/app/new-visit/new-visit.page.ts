import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import { ApiService } from '../services/api.service';

import * as L from 'leaflet';
import * as geoJSON from 'geojson';


@Component({
  selector: 'app-new-visit',
  templateUrl: './new-visit.page.html',
  styleUrls: ['./new-visit.page.scss'],
})

export class NewVisitPage implements OnInit {
	//variables de la page
	map:L.Map;
	id;
	marque;
	visite = [];
	mailles: geoJSON.FeatureCollection;
	observer = [];
	perturbations = [];
	compteReload = 0;
	modif = 100;
	eventInterval;

	totalMailles = 0;
	maillesNonVisite = 0;
	maillesPresence = 0;
	maillesAbsence = 0;

	form ={
		commentaires : "",
		date: "",
		observers : [],
		perturbations : []

	}

	dataSend = {
		"cor_visit_grid": [], 
		"id_base_visit": null, 
		"id_base_site": null, 
		"cor_visit_perturbation": [], 
		"comments": "", 
		"uuid_base_visit": null, 
		"id_digitiser": null, 
		"visit_date_max": null, 
		"observers": [], 
		"visit_date_min": null
	}
	
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
			//on call une lecture de données
			this.loadDataVisite(true,"visite",this.id);
			this.loadDataMailles(true, "maille",this.id);
			this.loadDataObserver(true, "observeur");
			this.loadDataPerturbations(true, "perturbations");
		});
		
	}
	
	/*fonctions de lecture de données*/
	loadDataVisite(refresh = false,type = "base",id, refresher?) {
		this.apiService.getData(refresh,type,id).subscribe(res => {
			this.visite = res[0];
			console.log("visite:");
			console.log(res[0]);
			if (refresher) {
        		refresher.target.complete();
      		}
		});
	 }
	loadDataMailles(refresh = false,type = "base",id, refresher?) {
		this.apiService.getData(refresh,type,id).subscribe(res => {
			this.mailles = res;
			console.log("mailles:");
			console.log(res);
			
			this.totalMailles = res.length;
			this.maillesNonVisite = this.totalMailles;

			if (refresher) {
        		refresher.target.complete();
			}
			  
			this.reload() //on appel un chargement de page
		});
	 }
	 loadDataObserver(refresh = false,type = "base", refresher?) {
		this.apiService.getData(refresh,type).subscribe(res => {
			this.observer = res[0];
			console.log("observers:");
			console.log(res[0]);
			if (refresher) {
        		refresher.target.complete();
      		}
		});
	 }
	 loadDataPerturbations(refresh = false,type = "base", refresher?) {
		this.apiService.getData(refresh,type).subscribe(res => {
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
		L.control.scale().addTo(this.map);
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
		
		
		var objet = L.geoJSON(this.mailles,{
		onEachFeature: (feature, layer) => 
		{
			layer.on("click", () => //au clique, envoi sur la page visionnage qui correspond
			{
				var utilise = false
				var presence = false
				var id = 0
				for(var i = 0; i <this.dataSend.cor_visit_grid.length; i++)
				{
					var element = this.dataSend.cor_visit_grid[i]
					if (element.id_area == feature.id)
					{
						utilise = true
						presence = element.presence
						id = i
					}
				}

				if(utilise == false) //pas vu to present
				{
					layer["setStyle"]({color:"#00FF00"});
					this.maillesPresence ++;
					var objet = { 
						"uuid_basevisite" : null,
						"id_area" : feature.id,
						"id_base_visit": null,
						"presence" : true

					}
					this.dataSend.cor_visit_grid.push(objet)
				}
				else if (utilise && presence) //present to absent
				{
					layer["setStyle"]({color:"#FF0000"});
					this.maillesAbsence ++;
					this.maillesPresence --;
					this.dataSend.cor_visit_grid[id].presence = false;
				}
				else //absent to pas vu
				{
					layer["setStyle"]({color:"#3388ff"});
					this.maillesAbsence --;
					if (this.dataSend.cor_visit_grid.length <= 1) //si y a qu'un element
					{
						this.dataSend.cor_visit_grid.pop()
					}
					else //si y en a plusieurs
					{
						this.dataSend.cor_visit_grid.splice(id,id+1)
					}
				}
				console.log(this.dataSend.cor_visit_grid)
				this.maillesNonVisite = this.totalMailles - this.maillesAbsence - this.maillesPresence;
				
				}) 
			} 
		}).addTo(this.map);	
		this.map.setView(objet.getBounds().getCenter(), 16);
		document.getElementById("affichChargement").setAttribute("hidden",null);
		this.compteReload = 0;
	}
	
	//quand on trouve l'utilisateur
	onLocationFound(e)
	{
		//on pose un marqueur sur sa position
		this.marque = L.marker(e["latlng"]).addTo(this.map)
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
		console.log("form")
		console.log(this.form)
		//TODO: Fout les données dans this.dataSend
		this.form.perturbations.forEach(element => {
			this.dataSend.cor_visit_perturbation.push(this.perturbations[element])
		});
		this.form.observers.forEach(element => {
			this.dataSend.observers.push(this.observer[element])
		});
		this.dataSend.id_base_site = this.id
		this.dataSend.visit_date_max = this.form.date
		this.dataSend.visit_date_min = this.form.date
		this.dataSend.comments = this.form.commentaires
		//this.dataSend.id_base_visit = null
		//this.dataSend.id_digitiser = null
		//this.dataSend.uuid_base_visit = null
		console.log("géré (beta):")
		console.log("les données sont stockées en local, et non envoyées, car non complète.")
		console.log(this.dataSend)
		this.apiService.setLocalData("visiteSite"+this.id,this.dataSend);
		this.router.navigate(['/home']);
	}
	
}
