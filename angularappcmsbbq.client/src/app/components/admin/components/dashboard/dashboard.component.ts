import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { AccountService } from '../../../../services/account/account.service';
import { LoginViewModel } from '../../../../models/loginViewModel';
import { TaskResult } from '../../../../models/taskResult';
import { InfoService } from '../../../../services/InfoService';
import { RejestratorLogowania } from '../../../../models/rejestratorLogowania';
import { GuidGenerator } from '../../../../services/guid-generator';
import { Guid } from 'guid-typescript';
import { RolesService } from '../../../../services/roles/roles.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  formGroupLogin !: FormGroup;
  formGroupRegister !: FormGroup;
  navigation!: any;
  isSidenavOpen = false;
  password: string = 'SDG%$@5423sdgagSDert';

  zalogowanyUserEmail: string | undefined = '';
  role: string = '';
  logowanie: boolean = false;
  isLoggedIn: boolean = false;

/*
  logowanieStyle: any = {
    'backgroundColor': 'rgb(250,250,250)',
    'cursor': 'pointer',
    'pointerEvents': 'auto'
  }*/

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    public roleService: RolesService,
    private router: Router,
    private snackBarService: SnackBarService,
  ) { }


  ngOnInit(): void { 
/*
    // ustawienie stylu dla przycisku
    this.logowanieStyle.backgroundColor = "rgb(250,250,250)";
    this.logowanieStyle.cursor = "pointer";
    this.logowanieStyle.pointerEvents = "auto";
*/

    // formularz logowania
    this.formGroupLogin = this.fb.group({
      emailLogin: ['admin@admin.pl', [Validators.required]],
      passwordLogin: ['SDG%$@5423sdgagSDert', [Validators.required]]
    });


    // formularz rejestracji
    this.formGroupRegister = this.fb.group({
      emailRegister: ['', [Validators.required, Validators.email]],
      passwordRegister: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?\/]).{8,}$/)]],
      imie: ['', [Validators.required]],
      nazwisko: ['', [Validators.required]],
      ulica: ['', [Validators.required]],
      numerUlicy: ['', [Validators.required]],
      miejscowosc: ['', [Validators.required]],
      kraj: ['', [Validators.required]],
      kodPocztowy: ['', [Validators.required]],
      dataUrodzenia: ['', [Validators.required]],
      telefon: ['', [Validators.required]],
    });

    this.formGroupLogin.markAllAsTouched();
    this.formGroupRegister.markAllAsTouched();



/*
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        this.zalogowanyUserEmail = sm.email;
        this.isLoggedIn = sm.isLoggedIn;
        this.role = sm.role;
      }
    }*/

  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }


  linkName: string = '';
  subLinkName: string = '';
  getLinkName(linkName: string): void {
    this.linkName = `${linkName}`;
  }


/*
  public login(form: FormGroup): void {


    this.logowanieStyle.backgroundColor = "rgb(200,200,200)";
    this.logowanieStyle.cursor = "pointer";
    this.logowanieStyle.pointerEvents = "none";



    // Pobranie wartości z kontrolek
    let email = form.controls['emailLogin'].value;
    let password = form.controls['passwordLogin'].value;


    // Przekazanie obiektu logowania do metody 
    let loginViewModel: LoginViewModel = {
      userId: '',
      email: email,
      password: password,
      token: '',
      expirationTimeToken: '',
      role: '',
    };


    this.logowanie = true;
    this.accountService.login(loginViewModel).subscribe({
      next: ((result: TaskResult<LoginViewModel>) => {

        if (result.success) {

          let loginViewModel = result.model as LoginViewModel;
          if (loginViewModel) {



            // zamiana daty na format "2024-12-12 12:12:00"
            let d = new Date();
            let dataZalogowania = d.toLocaleDateString() + " " + d.toLocaleTimeString();


            // zapisanie w sesji zalogowanego użytkownika
            let sessionModel = {
              isLoggedIn: true,
              userId: loginViewModel.userId,
              email: loginViewModel.email,
              role: loginViewModel.role,
              token: loginViewModel.token,
              expirationTimeToken: loginViewModel.expirationTimeToken,
              dataZalogowania: dataZalogowania
            };
            localStorage.setItem('sessionModel', JSON.stringify(sessionModel));

            this.zalogowanyUserEmail = loginViewModel.email;
            this.role = loginViewModel.role == null ? '' : loginViewModel.role;
            this.isLoggedIn = true;


            form.reset();
            this.router.navigate(['admin/users']);
            //this.router.navigate(['admin/users']).then(() => location.reload());


            // rejestrator logowania, tworzy wpis w bazie danych kiedy użytkownik był zalogowany
            //let userId = loginViewModel.userId == null ? '' : loginViewModel.userId;
            //this.rejestratorLogowaniaService.create(userId);

            
            this.logowanie = false;
            this.snackBarService.setSnackBar(`Zalogowany użytkownik: ${loginViewModel.email}`);
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



  public login(form: FormGroup): void {


    // Pobranie wartości z kontrolek
    let email = form.controls['emailLogin'].value;
    let password = form.controls['passwordLogin'].value;


    // Przekazanie obiektu logowania do metody 
    let loginViewModel: LoginViewModel = {
      userId: '',
      email: email,
      password: password,
      token: '',
      expirationTimeToken: '',
      role: '',
    };


    this.logowanie = true;
    this.accountService.login(loginViewModel).subscribe({
      next: ((result: TaskResult<LoginViewModel>) => {

        if (result.success) {

          let loginViewModel = result.model as LoginViewModel;
          if (loginViewModel) {



            // zamiana daty na format "2024-12-12 12:12:00"
            let d = new Date();
            let dataZalogowania = d.toLocaleDateString() + " " + d.toLocaleTimeString();


            // zamiana daty na format 2024-12-12T12:12:00
            let date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}T${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;


            // zapisanie w sesji zalogowanego użytkownika
            let sessionModel = {
              isLoggedIn: true,
              userId: loginViewModel.userId,
              email: loginViewModel.email,
              role: loginViewModel.role,
              token: loginViewModel.token,
              expirationTimeToken: loginViewModel.expirationTimeToken,
              dataZalogowania: dataZalogowania,
            };
            localStorage.setItem('sessionModel', JSON.stringify(sessionModel));

            this.zalogowanyUserEmail = loginViewModel.email;
            this.role = loginViewModel.role == null ? '' : loginViewModel.role;
            this.isLoggedIn = true;


            form.reset();
            this.router.navigate(['admin/users']);
            //this.router.navigate(['admin/users']).then(() => location.reload());


            // rejestrator logowania, tworzy wpis w bazie danych kiedy użytkownik był zalogowany
            //let userId = loginViewModel.userId == null ? '' : loginViewModel.userId;
            //this.rejestratorLogowaniaService.create(userId);


            this.logowanie = false;
            this.snackBarService.setSnackBar(`Zalogowany użytkownik: ${loginViewModel.email}`);
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
        //localStorage.removeItem('sessionModel');
        this.logowanie = false;
      }
    });



  }

 

}
