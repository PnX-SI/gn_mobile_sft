import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewVisitPage } from './new-visit.page';
import { AffichageComponent } from '../affichage/affichage.component';

const routes: Routes = [
  {
    path: '',
    component: NewVisitPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewVisitPage, 
    AffichageComponent]
})
export class NewVisitPageModule {}
