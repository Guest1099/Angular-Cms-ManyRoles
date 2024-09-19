import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from './account.service';
import { AccountHandlerService } from './account-handler.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../../models/category';
import { TaskResult } from '../../models/taskResult';
import { CategoriesHandlerService } from '../categories/categories-handler.service';
import { LoginViewModel } from '../../models/loginViewModel';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private accountService: AccountService,
    private accountHandlerService: AccountHandlerService,
    private router: Router
  ) { }
   

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let result = false;
    //alert('guard 1');
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
          dateToMiliseconds = this.accountHandlerService.changeDateToMiliseconds(expirationTimeToken); // zamienienie daty na milisekundy



          // Sprawdź, czy użytkownik jest zalogowany i ma odpowiednią rolę 
          if (this.accountHandlerService.isLoggedInGuard() && expectedRoles.includes(role)) {
            //alert('guard 2');


            if (Date.now() >= dateToMiliseconds) {
              //localStorage.removeItem('sessionModel');
              //this.accountServiceHandler.wyloguj();
              this.wyloguj();
            } else {
              result = true;
            }

            //result = true;
            return result;
          }
        }
      }
    }
    //alert('guard 4');

    // Przekieruj użytkownika do strony głównej, jeśli nie ma uprawnień
    // this.accountHandlerService.wyloguj();
    this.wyloguj();
    return result;
  }




  private once: boolean = true;
  // Metoda odpowiedzialna za wylogowanie
  private wyloguj(): void {
    if (this.once) {
      this.once = false;
      localStorage.removeItem('sessionModel');
      this.accountService.logout().subscribe({
        next: () => {
          //alert ('wyloguj 1')
          // Wyczyszczenie danych z pamięci podręcznej
          //localStorage.removeItem('sessionModel');
          //this.isLoggedIn = false;
          //this.router.navigate(['/']);
          //this.router.navigate(['admin']);
          //this.router.navigate(['/subcategories']);
          this.router.navigate(['admin']).then(() => location.reload());
        },
        error: (error: Error) => {
          alert('Wyloguj from auth guard');
        }
      });
    }
  }
   

}
