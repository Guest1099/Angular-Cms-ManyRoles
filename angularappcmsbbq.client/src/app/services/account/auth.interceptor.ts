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


  // pole ustawione po to aby metoda w interceptorze nie była wywoływana wielokrotnie
  private isLoggedOut = false;
  

  constructor(
    private accountService: AccountHandlerService,
    private router: Router
  ) {
    //alert('interceptor 1');



    // pobranie czasu zalogowania z sesji
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let loginViewModel = sm.model as LoginViewModel;
        if (loginViewModel) {
          let token = loginViewModel.token;
          let newToken = loginViewModel.newToken;

          let expirationTimeToken = loginViewModel.expirationTimeToken == null ? '' : loginViewModel.expirationTimeToken; //pierwszy token
          let expirationTimeNewToken = loginViewModel.expirationTimeNewToken == null ? '' : loginViewModel.expirationTimeNewToken; // drugi token

          let dateToMiliseconds !: number;
          dateToMiliseconds = this.accountService.changeDateToMiliseconds(expirationTimeToken); // zamienienie daty na milisekundy


          if (Date.now() >= dateToMiliseconds) {
            //localStorage.removeItem('sessionModel');
            this.accountService.wyloguj();
          }


        }
      } else {
        //alert('koniecznosc wylogowania');
        //this.accountService.wyloguj();
      }
    }
  }




  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //alert('interceptor 2');
    // Dodaj token JWT do nagłówka żądania, jeśli użytkownik jest zalogowany
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let loginViewModel = sm.model as LoginViewModel;
        if (loginViewModel) {
          let token = loginViewModel.token;
          let newToken = loginViewModel.newToken;

          let expirationTimeToken = loginViewModel.expirationTimeToken == null ? '' : loginViewModel.expirationTimeToken; //pierwszy token
          let expirationTimeNewToken = loginViewModel.expirationTimeNewToken == null ? '' : loginViewModel.expirationTimeNewToken; // drugi token

          let dateToMiliseconds !: number;
          dateToMiliseconds = this.accountService.changeDateToMiliseconds(expirationTimeToken); // zamienienie daty na milisekundy


          // jeżeli wygaśnie stary token przypisywany jest nowy
          if (Date.now() >= dateToMiliseconds) {
            //localStorage.removeItem('sessionModel');
            this.accountService.wyloguj();
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
      } else {
        //this.accountService.wyloguj();
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          this.isLoggedOut = true;
          // usunięcie użytkownika z sessji
          localStorage.removeItem('sessionModel');
          this.accountService.wyloguj();
        }

        return throwError(error);
      })
    );
  }



  tryLogout() {

  }
   
   

}

