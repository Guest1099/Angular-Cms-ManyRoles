import { Component, Inject, OnInit } from '@angular/core';
import { ApplicationUser } from '../../../../../../models/applicationUser';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '../../../../../../services/users/users.service';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrl: './user-delete.component.css'
})
export class UserDeleteComponent implements OnInit {

  constructor(
    public usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public user: ApplicationUser
  ) { }

  ngOnInit(): void {
  }


}
