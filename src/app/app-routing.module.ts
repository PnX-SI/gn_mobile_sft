import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'setting', loadChildren: './setting/setting.module#SettingPageModule' },
  { path: 'data-sync', loadChildren: './data-sync/data-sync.module#DataSyncPageModule' },
  { path: 'input-osb-et-date', loadChildren: './input-osb-et-date/input-osb-et-date.module#InputOsbEtDatePageModule' },
  { path: 'choose-observer', loadChildren: './choose-observer/choose-observer.module#ChooseObserverPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
