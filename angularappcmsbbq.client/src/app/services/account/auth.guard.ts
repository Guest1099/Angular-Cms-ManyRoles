import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from './account.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../../models/category';
import { TaskResult } from '../../models/taskResult';
import { LoginViewModel } from '../../models/loginViewModel';
import { RejestratorLogowania } from '../../models/rejestratorLogowania';
import { GuidGenerator } from '../guid-generator';
import { RejestratorLogowaniaService } from '../rejestratorLogowania/rejestrator-logowania.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private accountService: AccountService,
    private categoriesService: CategoriesService,
    private rejestratorLogowaniaService: RejestratorLogowaniaService,
    private router: Router
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let result = false;
    let expectedRoles = route.data['expectedRoles'] as Array<string>;

    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let role = sm.role;
        let token = sm.token;
 

        let dateNow = Date.now();
        let expirationTimeToken = this.accountService.changeDateToMiliseconds(sm.expirationTimeToken);
        let checkDate = dateNow > expirationTimeToken;

        // Sprawdź, czy użytkownik jest zalogowany i ma odpowiednią rolę 
        if (this.accountService.isLoggedInGuard() && expectedRoles.includes(role)) {
          result = true;


          if (checkDate) { 
            this.accountService.wyloguj();
          } else {
            result = true;
          }


          return result;
        }

      }
    }

    // Przekieruj użytkownika do strony głównej, jeśli nie ma uprawnień
    this.accountService.wyloguj();
    return result;
  }



}
