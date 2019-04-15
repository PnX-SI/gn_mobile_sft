import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'setting', loadChildren: './setting/setting.module#SettingPageModule' },
  { path: 'data-sync', loadChildren: './data-sync/data-sync.module#DataSyncPageModule' },
  { path: 'choose-observer', loadChildren: './choose-observer/choose-observer.module#ChooseObserverPageModule' },
  { path: 'start-input', loadChildren: './start-input/start-input.module#StartInputPageModule' },
  { path: 'new-visit', loadChildren: './new-visit/new-visit.module#NewVisitPageModule' },
  { path: 'visionnage', loadChildren: './visionnage/visionnage.module#VisionnagePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'see-visits', loadChildren: './see-visits/see-visits.module#SeeVisitsPageModule' },
  { path: 'see-my-visit', loadChildren: './see-my-visit/see-my-visit.module#SeeMyVisitPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
