import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskResult } from '../../../../../../models/taskResult';
import { ApplicationRole } from '../../../../../../models/applicationRole';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { InfoService } from '../../../../../../services/InfoService';
import { RolesService } from '../../../../../../services/roles/roles.service';
import { NavigationLinkNameService } from '../../../../../../services/NavigationLinkNameService';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.css'
})
export class RoleEditComponent implements OnInit {

  formGroup!: FormGroup;
  role !: ApplicationRole;

  constructor(
    private fb: FormBuilder,
    public rolesService: RolesService,
    public navigationLinkNameService: NavigationLinkNameService,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService
  ) { }


  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      if (id) {


        this.rolesService.get(id).subscribe({
          next: ((result: TaskResult<ApplicationRole>) => {
            if (result.success) {
              // pobranie danych
              this.role = result.model as ApplicationRole;

              if (this.role) {

                this.formGroup = this.fb.group({
                  name: [this.role.name, [Validators.required, Validators.minLength(2)]]
                });

              }

            } else {
              this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
            }
            return result;
          }),
          error: (error: Error) => {
            //alert(error);
            this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('ProductsHandlerService', 'get')}. Name: ${error.name}. Message: ${error.message}`);
          }
        });

      }
    });
  }


}
