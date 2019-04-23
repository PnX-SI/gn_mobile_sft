import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalVariablesService {

  private Settings = JSON

  constructor() 
  {

  }

  public getSettings()
  {
    return this.Settings;
  }

  public setSettings(settings)
  {
    this.Settings = settings;
  }

}
