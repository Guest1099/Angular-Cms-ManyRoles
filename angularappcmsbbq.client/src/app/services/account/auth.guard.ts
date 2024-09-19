import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from './account.service';
import { AccountHandlerService } from './account-handler.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../../models/category';
import { TaskResult } from '../../models/taskResult';
import { CategoriesHandlerService } from '../categories/categories-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private accountServiceHandler: AccountHandlerService,
    private router: Router
  ) { }
   

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    let expectedRoles = route.data['expectedRoles'] as Array<string>;
     

    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let role = sm.role;
        let isLoggedIn = sm.isLoggedIn;

        // Sprawdź, czy użytkownik jest zalogowany i ma odpowiednią rolę 
        if (this.accountServiceHandler.isLoggedInGuard() && expectedRoles.includes(role)) {
          return true;
        }
      }
    }

     
    // Przekieruj użytkownika do strony głównej, jeśli nie ma uprawnień 
    this.accountServiceHandler.wyloguj(); 
    return false;
  }

}
