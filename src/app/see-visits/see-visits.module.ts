import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SeeVisitsPage } from './see-visits.page';

const routes: Routes = [
  {
    path: '',
    component: SeeVisitsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SeeVisitsPage]
})
export class SeeVisitsPageModule {}
