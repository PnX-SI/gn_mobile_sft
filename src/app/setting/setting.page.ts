import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LocalVariablesService} from '../services/local-variables.service'
import { File } from '@ionic-native/file/ngx'


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
		private local: LocalVariablesService,
		private file: File
	) 
	{
		this.settings = this.local.getSettings()
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
			},err => {
				console.log("Erreur: impossible d'écrire dans settings.json")
			})
		},err =>
		{
			console.log("erreur: settings.json n'existe pas")
		})
	}

	goToHome()
	{
		this.router.navigate(['/home'])
	}
}
