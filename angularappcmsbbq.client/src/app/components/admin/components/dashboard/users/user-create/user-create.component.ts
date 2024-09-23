import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesService } from '../../../../../../services/roles/roles.service';
import { TaskResult } from '../../../../../../models/taskResult';
import { ApplicationRole } from '../../../../../../models/applicationRole';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { UsersService } from '../../../../../../services/users/users.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit {

  formGroup !: FormGroup;

  constructor(
    private fb: FormBuilder,
    public usersService: UsersService, 
    public rolesService: RolesService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {

    this.formGroup = this.fb.group({
      emailRegister: ['', [Validators.required]],
      passwordRegister: ['', [Validators.minLength(10), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?\/]).{8,}$/)]],
      imie: ['', [Validators.required/*, Validators.pattern(/^[A-Za-z]+$/)*/]],
      nazwisko: ['', [Validators.required]],
      ulica: ['', [Validators.required]],
      numerUlicy: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      miejscowosc: ['', [Validators.required]],
      kraj: ['', [Validators.required]],
      kodPocztowy: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],
      dataUrodzenia: ['', [Validators.required]],
      telefon: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      roleName: ['', [Validators.required]],
    });

    this.formGroup.markAllAsTouched();


    // pobranie ról i wyświetlenie ich w comboBoxie
    this.rolesService.getAll();
  }
}
