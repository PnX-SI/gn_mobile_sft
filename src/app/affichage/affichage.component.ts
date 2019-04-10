import { Component, OnInit, Input } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-affichage',
  templateUrl: './affichage.component.html',
  styleUrls: ['./affichage.component.scss'],
})
export class AffichageComponent implements OnInit {

  @Input() id
  data = []

  constructor
  (
    private router: Router,
    private route: ActivatedRoute,
		private apiService: ApiService
  ) 
  { 
    
  }

  //fonction de lecture de données
	loadData(refresh = false,type = "base",id = 0, refresher?) {
		this.apiService.getData(refresh,type,id).subscribe(res => {
      this.data = res;
			if (refresher) {
        		refresher.target.complete();
      		}
		});
 	}

  ngOnInit() {
    //on call une lecture de données
    this.loadData(true, "visite",this.id);
  }

  affich()
  {
    console.log(this.data)
  }

  CancelVisit()
	{
		// TODO:code pour annuler la saisie
		this.router.navigate(['/start-input']);
  }
  

}
