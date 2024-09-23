import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subsubcategory } from '../../../../../models/subsubcategory';
import { SubsubcategoryDeleteComponent } from './subsubcategory-delete/subsubcategory-delete.component';
import { TablePageCounterService } from '../../../../../services/table-page-counter.service';
import { SubcategoriesService } from '../../../../../services/subcategories/subcategories.service';
import { SubsubcategoriesService } from '../../../../../services/subsubcategories/subsubcategories.service';
import { AccountService } from '../../../../../services/account/account.service';

@Component({
  selector: 'app-subsubcategories',
  templateUrl: './subsubcategories.component.html',
  styleUrl: './subsubcategories.component.css'
})
export class SubsubcategoriesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public accountService: AccountService,
    public subsubcategoriesService: SubsubcategoriesService,
    public tablePageCounterService: TablePageCounterService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.subsubcategoriesService.initializeDataSource(this.paginator, this.sort);
  }



  openDialogDelete(subsubcategory: Subsubcategory): void {
    let openRef = this.dialog.open(SubsubcategoryDeleteComponent, {
      data: subsubcategory
    });
    openRef.afterClosed().subscribe();
  }


}
