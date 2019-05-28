import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StartInputPage } from './start-input.page';
import { TaxonPipe } from '../filtre/taxon.pipe';

const routes: Routes = [
  {
    path: '',
    component: StartInputPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StartInputPage, TaxonPipe]
})
export class StartInputPageModule {}
