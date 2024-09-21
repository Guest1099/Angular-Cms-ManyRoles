import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountHandlerService } from '../../../../../../services/account/account-handler.service';
import { ApplicationUser } from '../../../../../../models/applicationUser';
import { ApplicationRole } from '../../../../../../models/applicationRole';
import { AccountService } from '../../../../../../services/account/account.service';
import { RolesService } from '../../../../../../services/roles/roles.service';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { TaskResult } from '../../../../../../models/taskResult';
import { InfoService } from '../../../../../../services/InfoService';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrl: './change-email.component.css'
})
export class ChangeEmailComponent implements OnInit {

  formGroup !: FormGroup;

  constructor(
    private fb: FormBuilder,
    public accountHandlerService: AccountHandlerService
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newEmail: ['', [Validators.required, Validators.email]],
    });

    this.formGroup.markAllAsTouched();
  }


}
