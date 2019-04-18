import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NetworkService, ConnectionStatus } from '../services/network.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-sync',
  templateUrl: './data-sync.page.html',
  styleUrls: ['./data-sync.page.scss'],
})
export class DataSyncPage implements OnInit {
	
	progressBarRecupdonnee = 0
	disableButton = false
	
	constructor
	(
		private networkService: NetworkService, 
		private apiService: ApiService,
		private storage: Storage,
		private router: Router
	) 
	{
		
	}

	ngOnInit() 
	{
	
	}

	ionViewDidEnter() 
	{
		this.storage.get("user").then(res =>{
				if(!res)
				{
					this.disableButton = true
					var validation = confirm("vous n'êtes pas connecter. voulez vous vous connecter?")
					if(validation)
					{
						this.disableButton = false
						this.router.navigate(['/login',{back:"data-sync"}]);
					}
				}
			})
	}

	SaveToLocalData()
	{
		if(this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online)
		{
			this.progressBarRecupdonnee = 0 //reset la progress bar
			/*purge des anciennes données*/
			this.storage.remove("observeur")
			this.storage.remove("perturbations")
			this.apiService.getLocalData("base").then(res =>{
					res.forEach(element => {
						this.storage.remove("visite"+element.id)
						this.storage.remove("maille"+element.id)
					});
					this.storage.remove("base")
				}
			)
			/****************************/
			this.apiService.getData(true, "observeur").subscribe(res =>{
				this.apiService.setLocalData("observeur",res)
				this.progressBarRecupdonnee = this.progressBarRecupdonnee + 0.2 //+10% dans la progress bar	
			})
			this.apiService.getData(true, "perturbations").subscribe(res =>{
				this.apiService.setLocalData("perturbations",res)
				this.progressBarRecupdonnee = this.progressBarRecupdonnee + 0.2 //+10% dans la progress bar	
			})
			this.apiService.getData(true).subscribe(res =>{
				this.apiService.setLocalData("base",res)
				this.progressBarRecupdonnee = this.progressBarRecupdonnee + 0.2 //+10% dans la progress bar
				res.forEach(element => {
					this.apiService.getData(true,"visite",element.id).subscribe(elem =>{
						this.apiService.setLocalData("visite"+element.id,elem)
						this.progressBarRecupdonnee = this.progressBarRecupdonnee + (0.2/res.length)
					})
				});
				res.forEach(element => {
					this.apiService.getData(true,"maille",element.id).subscribe(elem =>{
						this.apiService.setLocalData("maille"+element.id,elem)
						this.progressBarRecupdonnee = this.progressBarRecupdonnee + (0.2/res.length)
					})
				});
			})
			
		}
		else
		{
			alert("Vous n'êtes pas connecté a internet.")
		}
	}

	SendVisits()
	{
		if(this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online)
		{
			console.log("Pas gérer, a voir quand tu aura un token valide")
		}
		else
		{
			alert("Vous n'êtes pas connecté a internet.")
		}
	}

	goToHome()
	{
		this.router.navigate(['/home']);
	}
}
