import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LocalVariablesService} from '../services/local-variables.service'


@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
	
	settings = JSON

	constructor
	(
		private router:Router,
		private local: LocalVariablesService
	) 
	{
		this.settings = local.getSettings()
	}

	ngOnInit() 
	{
		
	}
	
	setSettings()
	{

	}
}
