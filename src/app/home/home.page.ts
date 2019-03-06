import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	constructor(private router:Router) 
	{
	}

	ngOnInit() 
	{
	
	}
	public goToSetting()
	{
		this.router.navigate(['/setting'])
	}
	
	public goToSync()
	{
		this.router.navigate(['/data-sync'])
	}
	
	public goToInput()
	{
		this.router.navigate(['/start-input'])
	}
}
