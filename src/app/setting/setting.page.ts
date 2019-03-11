import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
	
	
	
	constructor
	(
		private router:Router,
		private appPreferences: AppPreferences
	) 
	{
		
	}

	ngOnInit() 
	{
		console.log(this.appPreferences.show());
	}
	
	public goToObserver()
	{
		this.router.navigate(['/choose-observer'])
	}
	
	public CpaFai()
	{
		console.log("t'as pas géré ça connard")
	}
}
