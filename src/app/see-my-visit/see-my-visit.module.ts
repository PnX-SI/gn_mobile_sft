import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SeeMyVisitPage } from './see-my-visit.page';

const routes: Routes = [
  {
    path: '',
    component: SeeMyVisitPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SeeMyVisitPage]
})
export class SeeMyVisitPageModule {}
