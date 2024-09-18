import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from './account.service';
import { AccountHandlerService } from './account-handler.service';
import { LoginViewModel } from '../../models/loginViewModel';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private accountServiceHandler: AccountHandlerService,
    private router: Router
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let result = false;
    let expectedRoles = route.data['expectedRoles'] as Array<string>;

    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let loginViewModel = sm.model as LoginViewModel;
        let role = sm.role;
        let isLoggedIn = sm.isLoggedIn;

        if (loginViewModel) {
          let token = loginViewModel.token;
          let newToken = loginViewModel.newToken;

          let expirationTimeToken = loginViewModel.expirationTimeToken == null ? '' : loginViewModel.expirationTimeToken; //pierwszy token
          let expirationTimeNewToken = loginViewModel.expirationTimeNewToken == null ? '' : loginViewModel.expirationTimeNewToken; // drugi token

          let dateToMiliseconds !: number;
          dateToMiliseconds = this.accountServiceHandler.changeDateToMiliseconds(expirationTimeToken); // zamienienie daty na milisekundy
           

          // Sprawdź, czy użytkownik jest zalogowany i ma odpowiednią rolę 
          if (this.accountServiceHandler.isLoggedInGuard() && expectedRoles.includes(role)) {

            if (Date.now() >= dateToMiliseconds) {
              this.accountServiceHandler.wyloguj();
            } else {
              result = true;
            }

            return result;
          }
        }
      }
    }

    // Przekieruj użytkownika do strony głównej, jeśli nie ma uprawnień 
    this.accountServiceHandler.wyloguj();
    return result;
  }


}
