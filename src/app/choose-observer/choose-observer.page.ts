import { Component, OnInit } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-choose-observer',
  templateUrl: './choose-observer.page.html',
  styleUrls: ['./choose-observer.page.scss'],
})
export class ChooseObserverPage implements OnInit {

	constructor() 
	{

	}

	ngOnInit() 
	{
	
	}
	
	public showSearchBar()
	{
		document.getElementById('srchbtn').setAttribute("hidden", null);
		document.getElementById('title').setAttribute("hidden", null);
		document.getElementById('srchbar').removeAttribute("hidden");
	}
	
	public hideSearchBar()
	{
		document.getElementById('srchbar').setAttribute("hidden", null);
		document.getElementById('srchbtn').removeAttribute("hidden");
		document.getElementById('title').removeAttribute("hidden");
	}
		
	public CpaFai()
	{
		console.log("t'as pas géré ça connard")
	}
}
