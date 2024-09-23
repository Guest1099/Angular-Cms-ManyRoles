import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Marka } from '../../../../../models/marka';
import { MarkaDeleteComponent } from './marka-delete/marka-delete.component';
import { FormControl } from '@angular/forms';
import { TablePageCounterService } from '../../../../../services/table-page-counter.service';
import { MarkiService } from '../../../../../services/marki/marki.service';
import { AccountService } from '../../../../../services/account/account.service';

@Component({
  selector: 'app-marki',
  templateUrl: './marki.component.html',
  styleUrl: './marki.component.css'
})
export class MarkiComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  

  constructor(
    public accountService: AccountService,
    public markiService: MarkiService,
    public tablePageCounterService: TablePageCounterService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void { 
  }

  ngAfterViewInit(): void {
    this.markiService.initializeDataSource(this.paginator, this.sort);
  }



  openDialogDelete(marka: Marka): void {
    let openRef = this.dialog.open(MarkaDeleteComponent, {
      data: marka
    });
    openRef.afterClosed().subscribe();
  }

}
