import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InputOsbEtDatePage } from './input-osb-et-date.page';

const routes: Routes = [
  {
    path: '',
    component: InputOsbEtDatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InputOsbEtDatePage]
})
export class InputOsbEtDatePageModule {}
