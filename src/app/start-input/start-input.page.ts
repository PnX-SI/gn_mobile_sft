import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

import * as L from 'leaflet';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-start-input',
  templateUrl: './start-input.page.html',
  styleUrls: ['./start-input.page.scss'],
})


export class StartInputPage implements OnInit {
	//variables de la page
	map:L.Map;
	marque;
	data = [];
	testeur = 0;
	modif = 100;
	eventInterval

	//chargement des imports
	constructor(
		private menu: MenuController, 
		private router: Router,
		private apiService: ApiService
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
		});
	  }

	ionViewDidEnter()//quand on rentre dans la page
	{			
		if(this.testeur == 0)
		{
			/*
			si c'est la première fois qu'on rentre dans la page, on fait ça
			On le fait pas dans le ngOnInit() parce que ça fout la merde
			et on le fait pas a chaque fois parce qu'a chaque appel y a un popup qui vient
			et c'est chiant pour l'utilisateur
			*/
			this.reload(); //on appel un chargement de page
			this.testeur = 1;
		}
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
		this.map = new L.Map('mapProspec');
		//on fait en sorte que la carte ai une échelle (pour se repérer c'est cool)
		L.control.scale("metric").addTo(this.map);

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

		//on supprime les marqueur s'ils existent
		if (this.marque)
		{
			this.marque.remove();
		}
		
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
		//on lui demande s'il veux être automatiquement envoyé sur la visite la plus proche de lui
		var confirmation = confirm("Vous avez été géolocaliser.\rVoulez vous que l'appli vérifie si vous êtes a proximité d'un lieu a visiter? (cela peut prendre du temps)")
		if(confirmation) // si l'utilisateur dit oui
		{
			//on utilise un algo de tri pour voir si l'utilisateur se trouve pas loin d'une visite
			var identifiant = NaN
			for (var i=0;i<this.data.length;i++) //lecture de la donnée stoquée en i
			{
				//préparation des données de bases
				var thisLength = this.data[i]["geometry"]["coordinates"][0][0].length
				var lonMin = this.data[i]["geometry"]["coordinates"][0][0][0][0]
				var lonMax = this.data[i]["geometry"]["coordinates"][0][0][thisLength-1][0]
				
				//début algo de tri pour trouver la plus basse longitude
				for (var j=0;j<this.data[i]["geometry"]["coordinates"][0][0].length;j++)
				{
					var min = j
					var max = this.data[i]["geometry"]["coordinates"][0][0].length-1
					
					for(var h=j+1;h<this.data[i]["geometry"]["coordinates"][0][0].length;h++)
					{
						if(this.data[i]["geometry"]["coordinates"][0][0][h][0]<this.data[i]["geometry"]["coordinates"][0][0][min][0])
						{
							min = h
						}
						else if (this.data[i]["geometry"]["coordinates"][0][0][h][0]>this.data[i]["geometry"]["coordinates"][0][0][max][0])
						{
							max = h
						}
					}
					if(min != j)
					{
						lonMin = this.data[i]["geometry"]["coordinates"][0][0][min][0]
						
					}
					if(max != this.data[i]["geometry"]["coordinates"][0][0].length-1)
					{
						lonMax = this.data[i]["geometry"]["coordinates"][0][0][max][0]
						
					}
					
				}//fin algo de tri pour trouver la plus basse longitude

				var latMin = this.data[i]["geometry"]["coordinates"][0][0][0][1]
				var latMax = this.data[i]["geometry"]["coordinates"][0][0][thisLength-1][1]
				//début algo de tri pour trouver la plus basse latitude
				for (var j=0;j<this.data[i]["geometry"]["coordinates"][0][0].length;j++)
				{
					var min = j
					var max = this.data[i]["geometry"]["coordinates"][0][0].length-1
					
					for(var h=j+1;h<this.data[i]["geometry"]["coordinates"][0][0].length;h++)
					{
						if(this.data[i]["geometry"]["coordinates"][0][0][h][1]<this.data[i]["geometry"]["coordinates"][0][0][min][1])
						{
							min = h
						}
						else if (this.data[i]["geometry"]["coordinates"][0][0][h][1]>this.data[i]["geometry"]["coordinates"][0][0][max][1])
						{
							max = h
						}
					}
					if(min != j)
					{
						latMin = this.data[i]["geometry"]["coordinates"][0][0][min][1]
						
					}
					if(max != this.data[i]["geometry"]["coordinates"][0][0].length-1)
					{
						latMax = this.data[i]["geometry"]["coordinates"][0][0][max][1]
						
					}
					
				}//fin algo de tri pour trouver la plus basse latitude
				
				//si on trouve une correspondance, on arrete l'algo plus tot
				if (lonMin <= e["longitude"] && e["longitude"]<=lonMax && latMin <= e["latitude"] && e["latitude"] <= latMax)
				{
					identifiant = this.data[i]["id"];
					break
				}
			} // fin de lecture de donnée
			
			/*//outil de débug
			//décommantez si vous voulez vérifier que la redirection ce fait bien
			// mais que vous n'êtes pas proche d'une visite
			var debug = confirm("Debug?")
			if(debug)
			{
				identifiant = parseInt(prompt("entrez un idendifiant", "2"));
			}*/
			

			if (identifiant) //si on a trouver une visite
			{
				alert("Nous avons trouvé une zone a visualiser autour de vous.\rRedirection.")
				// on place la vue sur l'utilisateur (pour que quand l'utilisateur part, il soit centré sur lui)
				this.map.setView(
					/*centre*/[e["latitude"], e["longitude"]],
					/*zoom*/11
					);
				//on redirige sur la page visionnage qui correspond
				this.router.navigate(['/visionnage',{id:identifiant}]);	
			}
			else //si on a rien trouver
			{
				alert("Nous n'avons pas trouvé de zone a visualiser autour de vous.\rNous allons afficher les environs autour de vous")
				//on centre la carte sur l'utilisateur
				this.map.setView(
					/*centre*/[e["latitude"], e["longitude"]],
					/*zoom*/11
					);
			}
		}
		else
		{
			alert("Nous allons afficher les environs autour de vous")
			//on centre la carte sur l'utilisateur
			this.map.setView(
				/*centre*/[e["latitude"], e["longitude"]],
				/*zoom*/11
				);
		}
		this.marque = L.marker(e["latlng"],L.Icon.Default).addTo(this.map); //on place une marque où ce trouve l'utilisateur
		//on indique qu'on a fini de charger
		document.getElementById("affichChargement").setAttribute("hidden",null);
	}
	
	//quand on ne trouve pas l'utilisateur
	onLocationError(e) {
		console.error(e.message)//on vois le message d'erreur sur la console
		alert(e.message + "\rNous allons afficher la carte par défaut");//on dit pourquoi on l'as pas trouver
		//on met l'utilisateur sur la carte par défaut
		this.map.setView(
		/*centre*/[44.5682846, 6.0634622],//devront être parametrables
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
