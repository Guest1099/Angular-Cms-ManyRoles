import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicationRole } from '../../../../../../models/applicationRole';
import { RolesService } from '../../../../../../services/roles/roles.service';

@Component({
  selector: 'app-role-delete',
  templateUrl: './role-delete.component.html',
  styleUrl: './role-delete.component.css'
})
export class RoleDeleteComponent implements OnInit {

  constructor(
    public rolesService: RolesService,
    @Inject(MAT_DIALOG_DATA) public role: ApplicationRole
  ) { }

  ngOnInit(): void {
  }


}
