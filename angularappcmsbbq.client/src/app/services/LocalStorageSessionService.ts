import { Injectable } from '@angular/core';
import { LoginViewModel } from '../models/loginViewModel';
import { AccountService } from './account/account.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageSessionService {

  constructor(
  ) { }

  private messageSourceAddLocalStorage = new BehaviorSubject<any>(null);
  public sessionModel = this.messageSourceAddLocalStorage.asObservable();



  public sessionModelIsNotEmpty(): boolean {
    let result: boolean = false;

    this.sessionModel.subscribe((s: any) => {
      if (s) {
        result = true;
      } else {
        result = false;
      }
    });

    return result;
  }


  public addSessionModel(sessionModel: any): void {
    this.messageSourceAddLocalStorage.next(sessionModel);

    // objekt należy zamienić na string jeśli chce się go dodać do sesji
    let transformSessionModelToString = JSON.stringify(sessionModel);
    localStorage.setItem('sessionModel', transformSessionModelToString);
  }


  public removeSessionModel() {
    localStorage.removeItem('sessionModel');
    this.messageSourceAddLocalStorage.next(null);
  }


/*
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
*/


  public tokenTimeExpired(): boolean {
    let result = false;

    this.sessionModel.subscribe((s: any) => {
      let sm = JSON.parse(s);
      if (sm) {
        let dateNow = Date.now();
        let expirationTimeToken = this.changeDateToMiliseconds(sm.expirationTimeToken);
        let checkDate = dateNow > expirationTimeToken;
        if (checkDate) {
          result = true;
        }
      }
    });

    return result;
  }


  /*public getToken(): string {
    let token = '';
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        token = sm.token == null ? '' : sm.token;
      }
    }
    return token;
  }*/


  public getToken (): any {
    let token !: any;
    this.sessionModel.subscribe((s: any) => {
      let sm = JSON.parse(s);
      if (sm) {
        token = sm.token;
      }
    });
    return token;
  }



  public getUserRole(): string {
    let role = '';
    this.sessionModel.subscribe((s: any) => {
      let sm = JSON.parse(s);
      if (sm) {
        role = sm.role;
      }
    });
    return role;
  }


  
  // Czyszczenie sesji jeśli użytkownik zamknie program lub przeglądarkę a token wygaśnie
  public clearSessionModelIfTimeExpired() {
    if (this.tokenTimeExpired()) {
      localStorage.removeItem('sessionModel');
      this.messageSourceAddLocalStorage.next(null);
    }
  }


  // Przekształca datę np. taką "12-12-2024,10:10:10" na milisekundy
  private changeDateToMiliseconds(dateString: string): number {
    let result: number = 0;
    let dateStringSplit = dateString.split(',');
    if (dateStringSplit.length > 0) {
      let date = dateStringSplit[0].split('-');
      let time = dateStringSplit[1].split(':');

      let year = '';
      let month = '';
      let day = '';

      let hour = '';
      let minute = '';
      let second = '';

      if (date.length > 2) {
        year = date[0];
        month = date[1];
        day = date[2];
      }

      if (time.length > 2) {
        hour = time[0];
        minute = time[1];
        second = time[2];
      }

      let newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
      result = newDate.getTime(); // data w milisekundach
    }
    return result;
  }


}
