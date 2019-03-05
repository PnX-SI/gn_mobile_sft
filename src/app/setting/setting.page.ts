import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
	
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
	
	public retourArriere()
	{
		this.router.navigate([this.prev_page]);
	}
	
}
