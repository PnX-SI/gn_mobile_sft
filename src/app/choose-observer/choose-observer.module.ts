import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChooseObserverPage } from './choose-observer.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseObserverPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChooseObserverPage]
})
export class ChooseObserverPageModule {}
