import { Injectable } from '@angular/core';
import { AccountHandlerService } from './account/account-handler.service';
import { LoginViewModel } from '../models/loginViewModel';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageSessionService {

  constructor(
    //private accountHandlerService: AccountHandlerService
  ) { }

/*

  public sessionStorageIsNotEmpty(): boolean {
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      return true;
    } else {
      return false;
    }
  }


  public setItemSession(key: string, object: any) {
    // objekt należy zamienić na string jeśli chce się go dodać do sesji
    let transformObjectToString = JSON.stringify(object);
    localStorage.setItem(key, object);
  }


  public removeItem(key: string) {
    localStorage.removeItem(key);
  }


  public test(): string {
    return "abc";
  }


  public tokenTimeExpired(): boolean {
    let result = false;

    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let token = sm.token == null ? '' : sm.token;
        let expirationTimeToken = sm.expirationTimeToken == null ? '' : sm.expirationTimeToken; //pierwszy token

        let dateToMiliseconds !: number;
        dateToMiliseconds = this.changeDateToMiliseconds(expirationTimeToken); // zamienienie daty na milisekundy

        if (Date.now() >= dateToMiliseconds) {
          result = true;
        }
      }
    }

    return result;
  }




  public getToken(): string {
    let token = '';
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        token = sm.token == null ? '' : sm.token;
      }
    }
    return token;
  }



  public getUserRole(): string {
    let role = '';
    let sessionModel = this.getSessionModel();
    if (sessionModel) {
      role = sessionModel.role;
    }
    return role;
  }




  public getSessionModel(): any {
    let result;
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        result = sm;
      }
    }
    return result;
  }



  // Przekształca datę np. taką "12.12.2024 10:10:10" na milisekundy
  private changeDateToMiliseconds(dateString: string): number {
    let [datePart, timePart] = dateString.split(' ');
    let [day, month, year] = datePart.split('.');
    let [hour, minute, second] = timePart.split(':');

    let date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
    return date.getTime(); // data w milisekundach
  }
*/

}
