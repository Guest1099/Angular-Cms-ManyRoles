import { Injectable, ViewChild } from '@angular/core';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../snack-bar.service';
import { ApplicationUser } from '../../models/applicationUser';
import { FormGroup } from '@angular/forms';
import { TaskResult } from '../../models/taskResult';
import { RegisterViewModel } from '../../models/registerViewModel';
import { GuidGenerator } from '../guid-generator';
import { InfoService } from '../InfoService';
import { ChangePasswordViewModel } from '../../models/changePasswordViewModel';
import { RejestratorLogowaniaHandlerService } from '../rejestratorLogowania/rejestrator-logowania-handler.service';
import { RejestratorLogowaniaService } from '../rejestratorLogowania/rejestrator-logowania.service';
import { RejestratorLogowania } from '../../models/rejestratorLogowania';
import { LoginViewModel } from '../../models/loginViewModel';
import { ChangeEmailViewModel } from '../../models/changeEmailViewModel';

@Injectable({
  providedIn: 'root'
})
export class AccountHandlerService {

  constructor(
    public accountService: AccountService,
    private rejestratorLogowaniaService: RejestratorLogowaniaService,
    private router: Router,
    private snackBarService: SnackBarService,
  ) {
  } 

  private user!: ApplicationUser;
  public formGroup!: FormGroup;
  public zalogowanyUser!: ApplicationUser;
  public zalogowanyUserEmail: string | undefined = '';
  public role: string = '';
  public isLoggedIn: boolean = false;
  public logowanie: boolean = false;
  public rejestrowanie: boolean = false;
  public zapisywanie: boolean = false;




  // Pobiera użytkownika poprzez email
  public getUserByEmail(email: string): ApplicationUser {

    this.accountService.getUserByEmail(email).subscribe({
      next: ((result: TaskResult<ApplicationUser>) => {
        if (result.success) {

          this.user = result.model as ApplicationUser;            

        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
        }

        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('AccountHandlerService', 'register')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });

    return this.user;
  }

   


  // rejestrowanie nowego użytkownika
  public register(form: FormGroup): void {

    let email = form.controls['emailRegister'].value;
    let password = form.controls['passwordRegister'].value;

    let imie = form.controls['imie'].value;
    let nazwisko = form.controls['nazwisko'].value;
    let ulica = form.controls['ulica'].value;
    let numerUlicy = form.controls['numerUlicy'].value;
    let miejscowosc = form.controls['miejscowosc'].value;
    let kodPocztowy = form.controls['kodPocztowy'].value;
    let kraj = form.controls['kraj'].value;
    let dataUrodzenia = form.controls['dataUrodzenia'].value;
    let telefon = form.controls['telefon'].value;
    let roleName = form.controls['roleName'].value;
     
     
    let registerViewModel: RegisterViewModel = {
      userId: GuidGenerator.newGuid().toString(),

      email: email,
      password: password,

      imie: imie,
      nazwisko: nazwisko,
      ulica: ulica,
      numerUlicy: numerUlicy,
      miejscowosc: miejscowosc,
      kodPocztowy: kodPocztowy,
      kraj: kraj,
      dataUrodzenia: dataUrodzenia.toISOString().split('T')[0],
      telefon: telefon,
      roleName: roleName
    };


    this.rejestrowanie = true;
    this.accountService.register(registerViewModel).subscribe({
      next: ((result: TaskResult<RegisterViewModel>) => {
        if (result.success) {
          this.snackBarService.setSnackBar('Zarejestrowano nowego użytkownika');
          this.rejestrowanie = false;
          form.reset();
        } else {
          this.snackBarService.setSnackBar(`Uzytkownik nie został zarejestrowany. ${result.message}`);
          this.rejestrowanie = false;
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('AccountHandlerService', 'register')}. Name: ${error.name}. Message: ${error.message}`);
        this.rejestrowanie = false;
      }
    });
  }

   


  // Aktualizowanie konta zalogowanego użytkownika, który jest administratorem
  public updateAccount(ob: ApplicationUser, form: FormGroup): void {

    let email = form.controls['email'].value;
    let imie = form.controls['imie'].value;
    let nazwisko = form.controls['nazwisko'].value;
    let ulica = form.controls['ulica'].value;
    let numerUlicy = form.controls['numerUlicy'].value;
    let miejscowosc = form.controls['miejscowosc'].value;
    let kodPocztowy = form.controls['kodPocztowy'].value;
    let kraj = form.controls['kraj'].value;
    let dataUrodzenia = form.controls['dataUrodzenia'].value;
    let telefon = form.controls['telefon'].value;
    let roleId = form.controls['roleId'].value;

    let user: ApplicationUser = {
      id: ob.id,
      email: email,
      imie: imie,
      nazwisko: nazwisko,
      ulica: ulica,
      numerUlicy: numerUlicy,
      miejscowosc: miejscowosc,
      kodPocztowy: kodPocztowy,
      kraj: kraj,
      dataUrodzenia: dataUrodzenia,
      telefon: telefon,
      roleId: roleId
    };

    this.zapisywanie = true;
    this.accountService.updateAccount(user).subscribe({
      next: ((result: TaskResult<ApplicationUser>) => {
        if (result.success) {
          this.snackBarService.setSnackBar(`Konto zostało zaktualizowane`);
          //this.router.navigate(['/users']);
          this.logowanie = false;
          this.zapisywanie = false;
        } else {
          this.snackBarService.setSnackBar(`${result.message}`);
          localStorage.removeItem('userToken');
          this.zapisywanie = false;
        }

        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('AccountHandlerService', 'updateAccount')}. Name: ${error.name}. Message: ${error.message}`);
        this.zapisywanie = false;
      }
    });
  }







  public changeEmail(form: FormGroup): void {

    let changeEmailViewModel: ChangeEmailViewModel = {
      email: form.controls['email'].value,
      newEmail: form.controls['newEmail'].value
    };

    this.zapisywanie = true;
    this.accountService.changeEmail(changeEmailViewModel).subscribe({
      next: ((result: TaskResult<ChangeEmailViewModel>) => {
        if (result.success) {
          this.snackBarService.setSnackBar(`Email został poprawnie zmieniony`);
          form.reset();
          this.zapisywanie = false;
        } else {
          this.snackBarService.setSnackBar(`Email nie został zmieniony. ${result.message}`);
          form.reset();
          this.zapisywanie = false;
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('AccountHandlerService', 'changePassword')}. Name: ${error.name}. Message: ${error.message}`);
        this.zapisywanie = false;
      }
    });
  }






  public changePassword(form: FormGroup): void {

    // pobranie danych użytkownika z sesji
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      let email = sm.email;

      if (email.length > 0) {
        let changePasswordViewModel: ChangePasswordViewModel = {
          email: email,
          oldPassword: form.controls['oldPassword'].value,
          newPassword: form.controls['newPassword'].value
        };

        this.zapisywanie = true;
        this.accountService.changePassword(changePasswordViewModel).subscribe({
          next: ((result: TaskResult<ChangePasswordViewModel>) => {
            if (result.success) {
              this.snackBarService.setSnackBar(`Hasło zostało poprawnie zmienione`);
              form.reset();
              this.zapisywanie = false;
            } else {
              this.snackBarService.setSnackBar(`Hasło nie zostało zmienione. ${result.message}`);
              form.reset();
              this.zapisywanie = false;
            }
            return result;
          }),
          error: (error: Error) => {
            this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('AccountHandlerService', 'changePassword')}. Name: ${error.name}. Message: ${error.message}`);
            this.zapisywanie = false;
          }
        });
      }
    }
  }



/*
  
  public login(form: FormGroup): void {

    // Pobranie wartości z kontrolek
    let email = form.controls['emailLogin'].value;
    let password = form.controls['passwordLogin'].value;


    // Przekazanie obiektu logowania do metody 
    let loginViewModel: LoginViewModel = {
      email: email,
      password: password,
      token: '',
      //newToken: '',
      expirationTimeToken: '',
      //expirationTimeNewToken: '',
      role: '',
      //dataZalogowania: '',
      //dataWylogowania: ''
    };

    this.logowanie = true;
    this.accountService.login(loginViewModel).subscribe({
      next: ((result: TaskResult<LoginViewModel>) => {

        if (result.success) {

          let loginViewModel = result.model as LoginViewModel;
          if (loginViewModel) {

            // zapisanie w sesji zalogowanego użytkownika
            let sessionModel = {
              isLoggedIn: true,
              email: loginViewModel.email,
              role: loginViewModel.role,
              token: loginViewModel.token,
              expirationTimeToken: loginViewModel.expirationTimeToken
              //dataZalogowania: result.model.dataZalogowania,
              //dataWylogowania: result.model.dataWylogowania
            };
            localStorage.setItem('sessionModel', JSON.stringify(sessionModel));

            this.zalogowanyUserEmail = loginViewModel.email;
            this.role = loginViewModel.role == null ? '' : loginViewModel.role;
            this.isLoggedIn = true;
            this.logowanie = false;



            form.reset();
            this.router.navigate(['admin/users']);
            //this.router.navigate(['admin/users']).then(() => location.reload());

            this.snackBarService.setSnackBar(`Zalogowany użytkownik: ${result.model.email}`);
          }
          
        } else {
          this.snackBarService.setSnackBar(`${InfoService.info('Dashboard', 'login')}. ${result.message}.`);
          localStorage.removeItem('sessionModel');
          this.isLoggedIn = false;
          this.logowanie = false;
          form.reset();
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('Dashboard', 'login')}. Name: ${error.name}. Message: ${error.message}`);
        localStorage.removeItem('sessionModel');
        this.logowanie = false;
      }
    });
  }

*/



  // Zmienna once oznacza, że metodę można jeden raz wywołać
  private once: boolean = true;
  // Metoda odpowiedzialna za wylogowanie
  public wyloguj(): void {
    if (this.once) {
      this.once = false;
      localStorage.removeItem('sessionModel');
      this.accountService.logout().subscribe({
        next: () => {
          // Wyczyszczenie danych z pamięci podręcznej
          //localStorage.removeItem('sessionModel');
          //this.isLoggedIn = false;
          //this.router.navigate(['/']);
          //this.router.navigate(['admin']);
          //this.router.navigate(['/subcategories']);
          this.router.navigate(['admin']).then(() => location.reload());
        },
        error: (error: Error) => {
          this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('AccountHandler', 'wyloguj')}. Name: ${error.name}. Message: ${error.message}`);
        }
      });
    }
  }




  public isLoggedInGuard(): boolean {
    let result: boolean = false;
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        // pobranie pierwszej roli użytkownika 
        this.role = sm.role;
        result = true;
      }
    }
    return result;
  }




  public isTimeExpiredToken(): boolean {
    let result = false;

    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let token = sm.token;
        //let newToken = loginViewModel.newToken;

        let expirationTimeToken = sm.expirationTimeToken == null ? '' : sm.expirationTimeToken; //pierwszy token
        //let expirationTimeNewToken = sm.expirationTimeNewToken == null ? '' : sm.expirationTimeNewToken; // drugi token

        let dateToMiliseconds !: number;
        dateToMiliseconds = this.changeDateToMiliseconds(expirationTimeToken); // zamienienie daty na milisekundy

        if (Date.now() >= dateToMiliseconds) {
          result = true;
        }

      }
    }
    return result;
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

   
/*
  // Przekształca datę np. taką "12.12.2024 10:10:10" na milisekundy
  public changeDateToMiliseconds(dateString: string): number {
    let [datePart, timePart] = dateString.split(' ');
    let [day, month, year] = datePart.split('.');
    let [hour, minute, second] = timePart.split(':');

    let date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
    return date.getTime(); // data w milisekundach
  }
  */




  // Przekształca datę np. taką "12.12.2024 10:10:10" na milisekundy
  public changeDateToMiliseconds(dateString: string): number {
    let result : number = 0;
    let dateStringSplit = dateString.split(' ');
    if (dateStringSplit.length > 0) {
      let date = dateStringSplit[0].split('.');
      let time = dateStringSplit[1].split(':');

      let day = '';
      let month = '';
      let year = '';

      let second = '';
      let minute = '';
      let hour = '';

      if (date.length > 2) {
        day = date[0];
        month = date[1];
        year = date[2];
      }

      if (time.length > 2) {
        second = time[0];
        minute = time[1];
        hour = time[2];
      }

      let newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
      result = newDate.getTime(); // data w milisekundach
    }
    return result;
  }




  public convertMilisecondToDate(miliseconds: number): string {
    let result = '';
    let date = new Date(miliseconds);
    let formattedDate = date.toLocaleString();
    let formattedDateSplit = formattedDate.split(',');
    if (formattedDateSplit.length > 0) {
      result = formattedDateSplit[0] + "" + formattedDateSplit[1];
    }
    return result;
  }

 



  public asTouchedDirtyLogin(form: FormGroup): boolean {
    if (
      form.controls['emailLogin'].valid &&
      form.controls['passwordLogin'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }


  public asTouchedDirtyRegister(form: FormGroup): boolean {
    if (
      form.controls['emailRegister'].valid &&
      form.controls['passwordRegister'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }




  public isValidCreate(form: FormGroup): boolean {
    if (
      form.controls['emailRegister'].touched && form.controls['emailRegister'].dirty && form.controls['emailRegister'].valid &&
      form.controls['passwordRegister'].touched && form.controls['passwordRegister'].dirty && form.controls['passwordRegister'].valid &&
      form.controls['imie'].touched && form.controls['imie'].dirty && form.controls['imie'].valid &&
      form.controls['nazwisko'].touched && form.controls['nazwisko'].dirty && form.controls['nazwisko'].valid &&
      form.controls['ulica'].touched && form.controls['ulica'].dirty && form.controls['ulica'].valid &&
      form.controls['numerUlicy'].touched && form.controls['numerUlicy'].dirty && form.controls['numerUlicy'].valid &&
      form.controls['miejscowosc'].touched && form.controls['miejscowosc'].dirty && form.controls['miejscowosc'].valid &&
      form.controls['kodPocztowy'].touched && form.controls['kodPocztowy'].dirty && form.controls['kodPocztowy'].valid &&
      form.controls['kraj'].touched && form.controls['kraj'].dirty && form.controls['kraj'].valid &&
      form.controls['dataUrodzenia'].touched && form.controls['dataUrodzenia'].dirty && form.controls['dataUrodzenia'].valid &&
      form.controls['telefon'].touched && form.controls['telefon'].dirty && form.controls['telefon'].valid &&
      form.controls['roleName'].touched && form.controls['roleName'].dirty && form.controls['roleName'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }


  public isValidCreateUser(form: FormGroup): boolean {
    if (
      form.controls['emailRegister'].touched && form.controls['emailRegister'].dirty && form.controls['emailRegister'].valid &&
      form.controls['passwordRegister'].touched && form.controls['passwordRegister'].dirty && form.controls['passwordRegister'].valid &&
      form.controls['imie'].touched && form.controls['imie'].dirty && form.controls['imie'].valid &&
      form.controls['nazwisko'].touched && form.controls['nazwisko'].dirty && form.controls['nazwisko'].valid &&
      form.controls['ulica'].touched && form.controls['ulica'].dirty && form.controls['ulica'].valid &&
      form.controls['numerUlicy'].touched && form.controls['numerUlicy'].dirty && form.controls['numerUlicy'].valid &&
      form.controls['miejscowosc'].touched && form.controls['miejscowosc'].dirty && form.controls['miejscowosc'].valid &&
      form.controls['kodPocztowy'].touched && form.controls['kodPocztowy'].dirty && form.controls['kodPocztowy'].valid &&
      form.controls['kraj'].touched && form.controls['kraj'].dirty && form.controls['kraj'].valid &&
      form.controls['dataUrodzenia'].touched && form.controls['dataUrodzenia'].dirty && form.controls['dataUrodzenia'].valid &&
      form.controls['telefon'].touched && form.controls['telefon'].dirty && form.controls['telefon'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }


  public isValidEdit(form: FormGroup): boolean {
    if (
      form.controls['imie'].valid &&
      form.controls['nazwisko'].valid &&
      form.controls['telefon'].valid &&
      form.controls['ulica'].valid &&
      form.controls['numerUlicy'].valid &&
      form.controls['miejscowosc'].valid &&
      form.controls['kraj'].valid &&
      form.controls['kodPocztowy'].valid &&
      form.controls['dataUrodzenia'].valid &&
      form.controls['roleId'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }



  public isValidUpdate(form: FormGroup): boolean {
    if (
      form.controls['imie'].valid &&
      form.controls['nazwisko'].valid &&
      form.controls['telefon'].valid &&
      form.controls['ulica'].valid &&
      form.controls['numerUlicy'].valid &&
      form.controls['miejscowosc'].valid &&
      form.controls['kodPocztowy'].valid &&
      form.controls['kraj'].valid &&
      form.controls['dataUrodzenia'].valid &&
      form.controls['roleId'].valid 
    ) {
      return false;
    }
    else {
      return true;
    }
  }





  public isValidChangeEmail(form: FormGroup): boolean {
    if (
      form.controls['email'].touched && form.controls['email'].dirty && form.controls['email'].valid &&
      form.controls['newEmail'].touched && form.controls['newEmail'].dirty && form.controls['newEmail'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }




  public isValidChangePassword(form: FormGroup): boolean {
    if (
      form.controls['oldPassword'].touched && form.controls['oldPassword'].dirty && form.controls['oldPassword'].valid &&
      form.controls['newPassword'].touched && form.controls['newPassword'].dirty && form.controls['newPassword'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }




}
