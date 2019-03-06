import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-choose-observer',
  templateUrl: './choose-observer.page.html',
  styleUrls: ['./choose-observer.page.scss'],
})
export class ChooseObserverPage implements OnInit {

  	public prev_page: String = '/home';
	
	constructor(private router:Router, private route: ActivatedRoute) 
	{
		this.route.params.subscribe(params => {
			if (params.back)
			{
				this.prev_page = params.back;
			}
		}) 
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
	
	public retourArriere()
	{
		this.router.navigate([this.prev_page]);
	}

}
