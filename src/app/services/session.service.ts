import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private login: String;
  private password: String;

  constructor() {

  }

  setLogin(login:String)
  {
    this.login =login;
  }

  setPassword(password:String)
  {
    this.password = password;
  }
  
  getLogin()
  {
    return this.login;
  }

  getPassword()
  {
    return this.password;
  }
}
