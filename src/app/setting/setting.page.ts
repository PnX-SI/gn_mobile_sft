import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LocalVariablesService} from '../services/local-variables.service'
import { File } from '@ionic-native/file/ngx'
import {Geolocation} from '@ionic-native/geolocation/ngx'
import {AppVersion} from '@ionic-native/app-version/ngx'



@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
	
	settings = JSON
	version = "0"

	constructor
	(
		private router:Router,
		private local: LocalVariablesService,
		private file: File,
		private geoloc: Geolocation,
		private appVersion: AppVersion
	) 
	{
		this.settings = this.local.getSettings()
		this.appVersion.getVersionNumber().then(res =>{
			this.version = res
		})
	}

	ngOnInit() 
	{
		
	}
	
	setSettings()
	{
		this.local.setSettings(this.settings);
		this.file.checkFile(this.file.externalDataDirectory+"settings/","settings.json").then(res =>
		{
			console.log("settings.json trouvé")
			this.file.writeExistingFile(this.file.externalDataDirectory+"settings","settings.json", JSON.stringify(this.settings)).then(res =>{
				console.log("ecriture de settings.json")
				alert("Vous devrez redemmarer l'application pour que les changements soient pris en compte")
			},err => {
				console.log("Erreur: impossible d'écrire dans settings.json")
			})
		},err =>
		{
			console.log("erreur: settings.json n'existe pas")
		})
	}

	getPos()
	{
		this.geoloc.getCurrentPosition().then(res=>{
			this.settings["Default_Lat"] = res.coords.latitude
			this.settings["Default_Lon"] = res.coords.longitude
		},err =>{
			alert(err.message)
		})
	}

	goToHome()
	{
		this.router.navigate(['/home'])
	}
}
