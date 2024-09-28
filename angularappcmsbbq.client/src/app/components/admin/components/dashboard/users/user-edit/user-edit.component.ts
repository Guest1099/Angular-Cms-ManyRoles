import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesService } from '../../../../../../services/roles/roles.service';
import { ActivatedRoute } from '@angular/router';
import { TaskResult } from '../../../../../../models/taskResult';
import { ApplicationUser } from '../../../../../../models/applicationUser';
import { ApplicationRole } from '../../../../../../models/applicationRole';
import { UsersService } from '../../../../../../services/users/users.service';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { InfoService } from '../../../../../../services/InfoService';
import { NavigationLinkNameService } from '../../../../../../services/NavigationLinkNameService';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {

  formGroup!: FormGroup;
  user !: ApplicationUser;

  constructor(
    private fb: FormBuilder,
    public usersService: UsersService,
    public rolesService: RolesService,
    public navigationLinkNameService: NavigationLinkNameService,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
  ) { }


  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      let id = params.get('id');

      if (id) {

        this.usersService.getUserById(id).subscribe({
          next: ((result: TaskResult<ApplicationUser>) => {
            if (result.success) {

              this.user = result.model as ApplicationUser;


              if (this.user) {

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

                // this.formGroup.controls['email'].disable();

              }

            } else {
              this.snackBarService.setSnackBar(`Użytkownik nie został załadowany. ${result.message}`);
            }

            return result;
          }),
          error: (error: Error) => {
            //alert(error.message);
            this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('UsersHandlerService', 'getUserByEmail')}. Name: ${error.name}. Message: ${error.message}`);
          }
        });


        // pobranie ról i wyświetlenie ich w comboBoxie
        this.rolesService.getAll();

      }
    });

  }

}
