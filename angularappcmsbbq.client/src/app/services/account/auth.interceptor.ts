import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HTTP_INTERCEPTORS, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../../models/category';
import { TaskResult } from '../../models/taskResult';
import { AccountService } from './account.service';
import { MarkiService } from '../marki/marki.service';
import { Marka } from '../../models/marka';
import { GuidGenerator } from '../guid-generator';
import { LoginViewModel } from '../../models/loginViewModel';
import { Router } from '@angular/router';
import { RejestratorLogowaniaService } from '../rejestratorLogowania/rejestrator-logowania.service';
import { RejestratorLogowania } from '../../models/rejestratorLogowania';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // tu nie mogą być wywoływane metody api, jedynie sesje, więc do wylogowania należy użyć wyczyszczenia sesji

  constructor(
    private accountService: AccountService,
    private rejestratorLogowaniaService: RejestratorLogowaniaService,
    private router: Router
  ) {
    //alert('interceptor 1');
    this.accountService.clearSessionModel();
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Dodaj token JWT do nagłówka żądania, jeśli użytkownik jest

    //alert('interceptor 2');
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let isLoggedIn = sm.isLoggedIn;
        let role = sm.role;
        let token = sm.token;

        let dateNow = Date.now();
        let expirationTimeToken = this.accountService.changeDateToMiliseconds(sm.expirationTimeToken);
        let checkDate = dateNow > expirationTimeToken;


        if (checkDate) {
          alert('date timeout expiration');
          //this.accountService.wyloguj('wyloguj from interceptor 1');
          this.accountService.wyloguj();
          //this.wyloguj();
        }
        /*if (checkDate) {
          alert('date timeout expiration');
          this.accountService.wyloguj('wyloguj from interceptor 1');
          //this.wyloguj();
        }*/ else {

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
        }
        else if (error.error) {
          this.accountService.wyloguj(); 
        }
        else if (error.status === 401) {
          this.accountService.wyloguj(); 
        }

        return throwError(error);
      })
    );
  }




  

  tryLogout() {

  }



}

