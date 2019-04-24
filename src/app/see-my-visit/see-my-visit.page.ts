import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { Storage } from '@ionic/storage';

import { ApiService } from '../services/api.service';

import * as L from 'leaflet';

@Component({
  selector: 'app-see-my-visit',
  templateUrl: './see-my-visit.page.html',
  styleUrls: ['./see-my-visit.page.scss'],
})
export class SeeMyVisitPage implements OnInit {
  //variables de la page
  map:L.Map;
  id;
  marque;
  visite = [];
  mailles = [];
  MyVisit = [];
  compteReload = 0;
  modif = 100;
  eventInterval;

  totalMailles = 0;
  maillesNonVisite = 0;
  maillesPresence = 0;
  maillesAbsence = 0;

  //chargement des imports
  constructor(
      private router:Router, 
      private route: ActivatedRoute,
      private apiService: ApiService,
      private storage:Storage
    ) 
  {
    //on lis les paramêtres qu'on a passé
    this.route.params.subscribe(params =>{
      this.id = params.id;
      
      //on call une lecture de données
      this.loadDataVisite(true,"visite",this.id);
      this.loadDataMailles(true, "maille",this.id);
    });  
    
  }

  /*fonctions de lecture de données*/
  loadDataVisite(refresh = false,type = "base",id = 0, refresher?) {
    this.apiService.getData(refresh,type,id).subscribe(res => {
      this.visite = res[0];
      if (refresher) {
            refresher.target.complete();
          }
    });
  }
  loadDataMailles(refresh = false,type = "base",id = 0, refresher?) {
    this.apiService.getData(refresh,type,id).subscribe(res => {
      this.mailles = res;
      console.log(res);
      
      this.totalMailles = res.length;

      //ont appelle la visite stocker en locale
      this.storage.get("visiteSite"+this.id).then((res) => {
        this.MyVisit = res
        console.log(this.MyVisit)
        this.maillesNonVisite = this.totalMailles - this.MyVisit["cor_visit_grid"].length

      }  
    )

      if (refresher) {
            refresher.target.complete();
          }
    });
  }
  /*****************************/

  ionViewDidEnter()//quand on rentre dans la page
  {	
    //on montre qu'on charge des truc
    document.getElementById("affichChargement").removeAttribute("hidden");
    setTimeout(() => this.reload(),100); //on appel un chargement de page
    //on fait en sorte que la carte soit affiché
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // tslint:disable-next-line
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18
    }).addTo(this.map);	
    
  }

  ngOnInit()  //quand on créé la page
  {
    //assignation de la carte
    this.map = new L.Map('mapVision');
    //on fait en sorte que la carte ai une échelle (pour se repérer c'est cool)
    L.control.scale("metric").addTo(this.map);
  }

  ionViewDidLeave()
  {
    //on ferme l'affichage
    document.getElementById('affichage').style.left = "100%"
    document.getElementById('affichage').style.right = "-75%"
    this.modif = 100;
  }

  reload()//fonction de (re)chargement
  {
    //on montre qu'on charge des truc
    document.getElementById("affichChargement").removeAttribute("hidden");
    //on ferme l'affichage
    clearInterval(this.eventInterval)
    this.eventInterval = setInterval(() => this.animAffic(true),1);
    //on recharge rapidement la carte
    this.map.invalidateSize(); 
    
    if(this.mailles.length >0)//si la donnée a pu se charger
    {
      var objet = L.geoJSON(this.mailles,{
        onEachFeature: (feature, layer) => 
        {
          this.MyVisit["cor_visit_grid"].forEach(element => {
            if (feature.id == element["id_area"])
            {
              if(element["presence"])
              {
                layer.setStyle({color:"#00FF00"});
                this.maillesPresence++
              }
              else
              {
                layer.setStyle({color:"#FF0000"});
                this.maillesAbsence++
              }
              
            }
          });          
        } 
      }).addTo(this.map);	
      this.map.setView(objet.getBounds().getCenter(), 16);
      document.getElementById("affichChargement").setAttribute("hidden",null);
      this.compteReload = 0;
    }
    else if (this.compteReload < 10)//sinon, on demande a recharger jusqu'à X fois
    {
      this.compteReload ++;
      setTimeout(() => this.reload(),100); 
    }
    else//Si ça répond pas au bout des X fois
    {
      alert ("nous n'avons pas réussi a récupérer les données. Veuillez appuyer sur le bouton de rafraichissement.")
      document.getElementById("affichChargement").setAttribute("hidden",null);
      this.compteReload = 0;
    }
  }	

  toggleAffichage()
  {
    if (this.modif > 25)
    {
      clearInterval(this.eventInterval)
      this.eventInterval = setInterval(() => this.animAffic(false),1);
    }
    else
    {
      clearInterval(this.eventInterval)
      this.eventInterval = setInterval(() => this.animAffic(true),1);
    }
  }
  
  animAffic(reverse:Boolean)
  {
    if (this.modif >= 25 && !reverse)
    {
      document.getElementById('affichage').style.left = this.modif+"%"
      document.getElementById('affichage').style.right = (25-this.modif)+"%"
      this.modif--
    }
    else if (this.modif <= 100 && reverse)
    {
      document.getElementById('affichage').style.left = this.modif+"%"
      document.getElementById('affichage').style.right = (25-this.modif)+"%"
      this.modif++
    }
    else 
    {
      clearInterval(this.eventInterval)
    }
    
  }

  goToHome()
  {
    this.router.navigate(['/home']);
  }
}
