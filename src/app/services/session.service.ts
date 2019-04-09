import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private token;

  constructor() {

  }

  setToken(token)
  {
    this.token = token;
  }

  getToken()
  {
    return this.token;
  }
}
