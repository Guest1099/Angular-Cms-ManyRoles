import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationUser } from '../../../../../models/applicationUser';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { TablePageCounterService } from '../../../../../services/table-page-counter.service';
import { AccountService } from '../../../../../services/account/account.service';
import { UsersService } from '../../../../../services/users/users.service';
import { RolesService } from '../../../../../services/roles/roles.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatPaginator) paginator !: MatPaginator;


  constructor(
    public accountService: AccountService,
    public usersService: UsersService,
    public rolesService: RolesService,
    public tablePageCounterService: TablePageCounterService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.rolesService.getAll();
  }

  ngAfterViewInit(): void {
    this.usersService.initializeDataSource(this.paginator, this.sort);
  }



  openDialogDelete(user: ApplicationUser): void {
    let openRef = this.dialog.open(UserDeleteComponent, {
      data: user
    });
    openRef.afterClosed().subscribe();
  }



}
