import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../../../../services/account/account.service';
import { RolesService } from '../../../../../../services/roles/roles.service';
import { TaskResult } from '../../../../../../models/taskResult';
import { ApplicationUser } from '../../../../../../models/applicationUser';
import { ApplicationRole } from '../../../../../../models/applicationRole';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { InfoService } from '../../../../../../services/InfoService';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit {


  formGroup!: FormGroup;
  user !: ApplicationUser;
  roles: ApplicationRole[] = [];

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    public roleService: RolesService,
    private snackBarService: SnackBarService
  ) { }


  ngOnInit(): void {

    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let email = sm.email;

        if (email) {
          this.getUserByEmail(email);
        }

        this.roleService.getAll();
      }
    }
  }
  


  getUserByEmail(email: string): void {

    this.accountService.getUserByEmail(email).subscribe({
      next: ((result: TaskResult<ApplicationUser>) => {
        if (result.success) {

          this.user = result.model as ApplicationUser;

          if (this.user != null) {
            this.formGroup = this.fb.group({
              email: [this.user.email, [Validators.required]],
              imie: [this.user.imie, [Validators.required]],
              nazwisko: [this.user.nazwisko, [Validators.required]],
              ulica: [this.user.ulica, [Validators.required]],
              numerUlicy: [this.user.numerUlicy, [Validators.required, Validators.pattern(/^\d+$/)]],
              miejscowosc: [this.user.miejscowosc, [Validators.required]],
              kraj: [this.user.kraj, [Validators.required]],
              kodPocztowy: [this.user.kodPocztowy, [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],
              dataUrodzenia: [this.user.dataUrodzenia, [Validators.required]],
              telefon: [this.user.telefon, [Validators.required, Validators.pattern(/^\d+$/)]],
              roleId: [this.user.roleId, [Validators.required]],
            });



            this.formGroup.controls['email'].disable();

            this.formGroup.markAllAsTouched();
          }


        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
        }

        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('AccountHandlerService', 'register')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });


  }

   


}

