import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LocalVariablesService {
  private Settings = JSON;

  private ListVisit = [];
  constructor() {}

  public getSettings() {
    return this.Settings;
  }

  public setSettings(settings) {
    this.Settings = settings;
  }

  public getListVisit() {
    return this.ListVisit;
  }

  public setListVisit(listVisit) {
    this.ListVisit = listVisit;
  }
}
