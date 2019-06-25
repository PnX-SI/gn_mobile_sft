import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from "@angular/common/http";
import { Network } from "@ionic-native/network/ngx";
import { File } from "@ionic-native/file/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { SQLite } from "@ionic-native/sqlite/ngx";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    File,
    Geolocation,
    AppVersion,
    SQLite,
    Diagnostic
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
