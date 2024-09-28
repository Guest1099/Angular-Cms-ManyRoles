import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Category } from '../../../../../models/category';
import { CategoryDeleteComponent } from './category-delete/category-delete.component';
import { TablePageCounterService } from '../../../../../services/table-page-counter.service';
import { CategoriesService } from '../../../../../services/categories/categories.service';
import { AccountService } from '../../../../../services/account/account.service';
import { NavigationLinkNameService } from '../../../../../services/NavigationLinkNameService';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  constructor(
    public accountService: AccountService,
    public categoriesService: CategoriesService,
    public tablePageCounterService: TablePageCounterService,
    public navigationLinkNameService: NavigationLinkNameService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.categoriesService.initializeDataSource(this.paginator, this.sort);
  }
   


  getText(text: string, iloscZnakow: number): string {
    if (text.length > iloscZnakow) {
      return `${text.substring(0, iloscZnakow)}...`;
    } else {
      return text;
    }
  }
  

  openDialogDelete(category: Category): void {
    let openRef = this.dialog.open(CategoryDeleteComponent, {
      data: category
    });
    openRef.afterClosed().subscribe();
  }



}
