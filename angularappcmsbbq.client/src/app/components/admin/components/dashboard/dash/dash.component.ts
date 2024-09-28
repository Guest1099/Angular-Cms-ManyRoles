import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../../services/account/account.service';
import { RolesService } from '../../../../../services/roles/roles.service';
import { CategoriesService } from '../../../../../services/categories/categories.service';
import { SubcategoriesService } from '../../../../../services/subcategories/subcategories.service';
import { SubsubcategoriesService } from '../../../../../services/subsubcategories/subsubcategories.service';
import { UsersService } from '../../../../../services/users/users.service';
import { MarkiService } from '../../../../../services/marki/marki.service';
import { ProductsService } from '../../../../../services/products/products.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.css'
})
export class DashComponent implements OnInit {

  constructor(
    public accountService: AccountService,
    public rolesService: RolesService,
    public usersService: UsersService,
    public markiService: MarkiService,
    public productsService: ProductsService,
    public categoriesService: CategoriesService,
    public subcategoriesService: SubcategoriesService,
    public subsubcategoriesService: SubsubcategoriesService, 
  ) { }


  ngOnInit(): void {
    this.rolesService.getAll();
    this.usersService.getAll();
    this.markiService.getAll();
    this.productsService.getAll();
    this.categoriesService.getAll();
    this.subcategoriesService.getAll();
    this.subsubcategoriesService.getAll();
  }

}
