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
    private categoriesService: CategoriesService,
    private accountHandlerService: AccountHandlerService,
    private router: Router
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let result = false;
    //alert('guard 1');
    let expectedRoles = route.data['expectedRoles'] as Array<string>;

/*
    this.categoriesService.getAll().subscribe({
      next: ((result: TaskResult<Category[]>) => {
        if (result.success) {
          // pobranie danych
          alert('ok');
        }
        return result;
      }),
      error: (error: Error) => {
        alert('error');
      }
    });
*/

    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let role = sm.role;
        let token = sm.token;

/*
        //let newToken = loginViewModel.newToken;
        let expirationTimeToken = sm.expirationTimeToken == null ? '' : sm.expirationTimeToken; //pierwszy token
        //let expirationTimeNewToken = sm.expirationTimeNewToken == null ? '' : sm.expirationTimeNewToken; // drugi token

        let dateToMiliseconds !: number;
        dateToMiliseconds = this.accountHandlerService.changeDateToMiliseconds(expirationTimeToken); // zamienienie daty na milisekundy


        // przekształcenie dany w format 12.12.2024 10:10:10
        let dateNow = `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
        let dateNowToMiliseconds = this.accountHandlerService.changeDateToMiliseconds(dateNow);


        let a = new Date();
        let b = Date.now();
        let c = new Date(b);

        alert(new Date().toLocaleTimeString() + "------" + expirationTimeToken);



        let first = "2024-12-12T11:11:00";
        let second = "2024-12-12T12:12:00";
        let x = new Date(first) > new Date(second);
        */



        // zamiana daty na format 2024-12-12T12:12:00
        let d = new Date();
        let date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}T${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

        let checkDate = date > sm.expirationTimeToken;

        //alert(date + "==========" + sm.expirationTimeToken);


        // Sprawdź, czy użytkownik jest zalogowany i ma odpowiednią rolę 
        if (this.accountHandlerService.isLoggedInGuard() && expectedRoles.includes(role)) {
          //alert('guard 2');

          result = true;

          //JAK SPRAWDZIĆ UPŁYNIĘCIE CZASU TOKENA NIE UŻYWAJĄC DATY?



           /*
          if (this.tokenTimeExpired()) { 
            this.wyloguj(); 
          } else {
            result = true;
          }
*/

/*
          let x = Date.now() > sm.expirationTimeToken;
           
          if (x) { 
            //localStorage.removeItem('sessionModel');
            //this.accountServiceHandler.wyloguj();
            this.wyloguj();
          } else {
            result = true;
          }
*/


          if (checkDate) {
            //localStorage.removeItem('sessionModel');
            //this.accountServiceHandler.wyloguj();
            this.wyloguj();
          } else {
            result = true;
          }


/*
          //if (Date.now() >= dateToMiliseconds) {
          if (dateNowToMiliseconds >= dateToMiliseconds) {
            //localStorage.removeItem('sessionModel');
            //this.accountServiceHandler.wyloguj();
            this.wyloguj();
          } else {
            result = true;
          }
*/

          return result;
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





  private res: boolean = false;
  public tokenTimeExpired(): boolean {
    //alert('1');
    // let res = false;

    localStorage.removeItem('userToken');
    this.accountService.tokenTimeExpired().subscribe({
      next: ((result: TaskResult<boolean>) => {
        //alert('2');
        if (result.success) {
          this.res = true;
          //alert('success');
        } else {
          this.res = false;
          //alert('czas tokenu jeszcze nie upłynął');
        }

        return result;
      }),
      error: (error: Error) => {
        this.res = false;
        alert('error');
      }
    });

    return this.res;
  }




  public convertFromCSharpToJavaScriptDate (): string {
    let result = '';/*
    let date = new Date(miliseconds);
    let formattedDate = date.toLocaleString();
    let formattedDateSplit = formattedDate.split(',');
    if (formattedDateSplit.length > 0) {
      result = formattedDateSplit[0] + "" + formattedDateSplit[1];
    }*/
    return result;
  }


}
