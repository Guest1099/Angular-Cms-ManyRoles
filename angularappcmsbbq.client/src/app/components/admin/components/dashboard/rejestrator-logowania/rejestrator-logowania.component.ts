import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { RejestratorLogowania } from '../../../../../models/rejestratorLogowania';
import { RejestratorLogowaniaDeleteComponent } from './rejestrator-logowania-delete/rejestrator-logowania-delete.component';
import { TablePageCounterService } from '../../../../../services/table-page-counter.service';
import { AccountService } from '../../../../../services/account/account.service';
import { UsersService } from '../../../../../services/users/users.service';
import { RejestratorLogowaniaService } from '../../../../../services/rejestratorLogowania/rejestrator-logowania.service';
import { NavigationLinkNameService } from '../../../../../services/NavigationLinkNameService';

@Component({
  selector: 'app-rejestrator-logowania',
  templateUrl: './rejestrator-logowania.component.html',
  styleUrl: './rejestrator-logowania.component.css'
})
export class RejestratorLogowaniaComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public accountService: AccountService,
    public rejestratorLogowaniaService: RejestratorLogowaniaService,
    public usersService: UsersService,
    public tablePageCounterService: TablePageCounterService,
    public navigationLinkNameService: NavigationLinkNameService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.usersService.getAll();
  }

  ngAfterViewInit(): void {
    this.rejestratorLogowaniaService.initializeDataSource(this.paginator, this.sort);
  }


  dataWylogowania (dataWylogowania: string): string {
    if (dataWylogowania.length > 0) {
      return dataWylogowania;
    } else {
      return 'zalogowany';
    }
  }

  czasZalogowania (czasZalogowania: string): string {
    if (czasZalogowania.length > 0) {
      return czasZalogowania;
    } else {
      return '-';
    }
  }



  openDialogDelete(rejestratorLogowania: RejestratorLogowania): void {
    let openRef = this.dialog.open(RejestratorLogowaniaDeleteComponent, {
      data: rejestratorLogowania
    });
    openRef.afterClosed().subscribe();
  }


}
