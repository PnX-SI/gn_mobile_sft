import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AngularFrameworkDelegate } from '@ionic/angular/dist/providers/angular-delegate';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
		
	constructor
	(
		private router:Router
	) 
	{
		
	}

	ngOnInit() 
	{
		
	}
		
	public CpaFai()
	{
		console.log("t'as pas géré ça connard")
	}

	ok(value)
	{
		alert("ok:"+value);
	}

	fail (error)
	{
		console.error("ERREUR:"+error);
	}
}
