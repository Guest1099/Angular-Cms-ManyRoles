import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
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
import { LocalStorageSessionService } from '../local-storage-session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private accountService: AccountHandlerService,
    //private localStorageSessionService: LocalStorageSessionService,
    private router: Router,
  ) {

    if (this.tokenTimeExpired()) {
      this.accountService.wyloguj();
    } else {
      //alert('koniecznosc wylogowania');
      //this.accountService.wyloguj();
    }

  }



  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.tokenTimeExpired()) {
      this.accountService.wyloguj();
    } else {

      // Dodaj token JWT do nagłówka żądania, jeśli użytkownik jest zalogowany
      if (this.token.length > 0) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.token}`
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {

          // usunięcie użytkownika z sessji
          this.accountService.wyloguj();
        }

        return throwError(error);
      })
    );
  }



  private token: string = '';
  private tokenTimeExpired(): boolean {
    let result = false;

    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let loginViewModel = sm.model as LoginViewModel;
        if (loginViewModel) {
          this.token = loginViewModel.token == null ? '' : loginViewModel.token;

          let expirationTimeToken = loginViewModel.expirationTimeToken == null ? '' : loginViewModel.expirationTimeToken; //pierwszy token

          let dateToMiliseconds !: number;
          dateToMiliseconds = this.accountService.changeDateToMiliseconds(expirationTimeToken); // zamienienie daty na milisekundy


          if (Date.now() >= dateToMiliseconds) {
            result = true;
          }
        }
      }
    }

    return result;
  }




  tryLogout() {

  }


}

