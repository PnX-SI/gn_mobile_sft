import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Settings} from '../app.component'


@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
	
	latitude
	longitude
	Api_URL
	Api_Dir

	constructor
	(
		private router:Router
	) 
	{
		this.latitude = Settings.Default_Lat
		this.longitude = Settings.Default_Lon
		this.Api_Dir = Settings.API_Dir
		this.Api_URL = Settings.API_URL
	}

	ngOnInit() 
	{
		
	}
		
	public CpaFai()
	{
		console.log("t'as pas géré ça connard")
	}

	test()
	{
		
	}
}
