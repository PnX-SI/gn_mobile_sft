import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-affichage',
  templateUrl: './affichage.component.html',
  styleUrls: ['./affichage.component.scss'],
})
export class AffichageComponent implements OnInit {

  constructor
  (
    private router: Router,
    private route: ActivatedRoute,
			private apiService: ApiService
  ) 
  { 
    
  }

  ngOnInit() {}

  CancelVisit()
	{
		// TODO:code pour annuler la saisie
		this.router.navigate(['/start-input']);
	}
}
