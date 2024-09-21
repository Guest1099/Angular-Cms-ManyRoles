import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HTTP_INTERCEPTORS, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AccountHandlerService } from './account-handler.service';
import { CategoriesService } from '../categories/categories.service';
import { CategoriesHandlerService } from '../categories/categories-handler.service';
import { Category } from '../../models/category';
import { TaskResult } from '../../models/taskResult';
import { AccountService } from './account.service';
import { MarkiService } from '../marki/marki.service';
import { Marka } from '../../models/marka';
import { GuidGenerator } from '../guid-generator';
import { LoginViewModel } from '../../models/loginViewModel';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // tu nie mogą być wywoływane metody api, jedynie sesje, więc do wylogowania należy użyć wyczyszczenia sesji

  constructor(
    private accountService: AccountService,
    private accountHandlerService: AccountHandlerService,
    private router: Router
  ) {
    //alert('interceptor 1');
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //alert('interceptor 2');
    // Dodaj token JWT do nagłówka żądania, jeśli użytkownik jest

    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let isLoggedIn = sm.isLoggedIn;
        let role = sm.role;
        let token = sm.token;
        let expirationTimeToken = sm.expirationTimeToken;
/*
        let expirationTimeToken = sm.expirationTimeToken == null ? '' : sm.expirationTimeToken; // pierwszy token
        let dateToMiliseconds !: number;
        dateToMiliseconds = this.accountHandlerService.changeDateToMiliseconds(expirationTimeToken); // zamienienie daty na milisekundy
*/


        // zamiana daty na format 2024-12-12T12:12:00
        let d = new Date();
        let date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}T${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

        let checkDate = date > expirationTimeToken;


        if (checkDate) {
          //localStorage.removeItem('sessionModel');
          //alert('token time expired')
          //this.accountHandlerService.wyloguj();
          this.wyloguj();
        //........................................ tutaj można odświeżyć lub przekierować na stronę

        } else {

          if (token) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
        }
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.ok) {
          alert('ok');
        }
        else if (error.error) {
          //alert('error');
          this.wyloguj();
        }
        else if (error.status === 401) {
          //localStorage.removeItem('sessionModel');
          //this.accountHandlerService.wyloguj();
          //alert('401');
          this.wyloguj();
        }

        return throwError(error);
      })
    );
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
          alert('Wyloguj from interceptor');
        }
      });
    }
  }




  tryLogout() {

  }



}

