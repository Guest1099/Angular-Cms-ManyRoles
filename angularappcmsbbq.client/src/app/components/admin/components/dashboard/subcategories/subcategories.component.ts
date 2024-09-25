import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subcategory } from '../../../../../models/subcategory';
import { SubcategoryDeleteComponent } from './subcategory-delete/subcategory-delete.component';
import { TablePageCounterService } from '../../../../../services/table-page-counter.service';
import { SubsubcategoriesService } from '../../../../../services/subsubcategories/subsubcategories.service';
import { AccountService } from '../../../../../services/account/account.service';
import { CategoriesService } from '../../../../../services/categories/categories.service';
import { SubcategoriesService } from '../../../../../services/subcategories/subcategories.service';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrl: './subcategories.component.css'
})
export class SubcategoriesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public accountService: AccountService,
    public subcategoriesService: SubcategoriesService,
    public tablePageCounterService: TablePageCounterService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.subcategoriesService.initializeDataSource(this.paginator, this.sort);
  }



  openDialogDelete(subcategory: Subcategory): void {
    let openRef = this.dialog.open(SubcategoryDeleteComponent, {
      data: subcategory
    });
    openRef.afterClosed().subscribe();
  }

}
