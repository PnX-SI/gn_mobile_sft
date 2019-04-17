import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NetworkService, ConnectionStatus } from '../services/network.service';


@Component({
  selector: 'app-data-sync',
  templateUrl: './data-sync.page.html',
  styleUrls: ['./data-sync.page.scss'],
})
export class DataSyncPage implements OnInit {
	
	
	constructor
	(
		private networkService: NetworkService, 
		private apiService: ApiService
	) 
	{
		
	}

	ngOnInit() 
	{
	
	}

	SaveToLocalData()
	{
		if(this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online)
		{
			console.log("Pas gérer, a voir comment gérer ça")
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
}
