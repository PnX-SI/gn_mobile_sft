import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'setting', loadChildren: './setting/setting.module#SettingPageModule' },
  { path: 'data-sync', loadChildren: './data-sync/data-sync.module#DataSyncPageModule' },
  { path: 'choose-observer', loadChildren: './choose-observer/choose-observer.module#ChooseObserverPageModule' },
  { path: 'start-input', loadChildren: './start-input/start-input.module#StartInputPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
