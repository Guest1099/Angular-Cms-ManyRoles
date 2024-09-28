import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesService } from '../../../../../../services/roles/roles.service';
import { NavigationLinkNameService } from '../../../../../../services/NavigationLinkNameService';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.css'
})
export class RoleCreateComponent implements OnInit {


  formGroup !: FormGroup;

  constructor(
    private fb: FormBuilder,
    public rolesService: RolesService,
    public navigationLinkNameService: NavigationLinkNameService,
  ) { }


  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.formGroup.markAllAsTouched();
  }
}
