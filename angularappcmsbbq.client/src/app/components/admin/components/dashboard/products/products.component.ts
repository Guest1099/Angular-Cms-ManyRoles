import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../../../models/product';
import { ProductDeleteComponent } from './product-delete/product-delete.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TablePageCounterService } from '../../../../../services/table-page-counter.service';
import { AccountService } from '../../../../../services/account/account.service';
import { ProductsService } from '../../../../../services/products/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public accountService: AccountService,
    public productsService: ProductsService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public tablePageCounterService: TablePageCounterService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.productsService.initializeDataSource(this.paginator, this.sort);
  }


  takeText(text: string, length: number): string {
    if (text.length > length) {
      return text.substring(0, length);
    } else {
      return text;
    }
  }



  openDialogDelete(product: Product): void {
    let openRef = this.dialog.open(ProductDeleteComponent, {
      data: product
    });
    openRef.afterClosed().subscribe();
  }


}
