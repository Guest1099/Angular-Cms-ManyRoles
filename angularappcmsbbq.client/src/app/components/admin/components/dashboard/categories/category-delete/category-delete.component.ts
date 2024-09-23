import { Component, Inject, OnInit } from '@angular/core';
import { Category } from '../../../../../../models/category';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriesService } from '../../../../../../services/categories/categories.service';

@Component({
  selector: 'app-category-delete',
  templateUrl: './category-delete.component.html',
  styleUrl: './category-delete.component.css'
})
export class CategoryDeleteComponent implements OnInit {

  constructor(
    public categoriesService: CategoriesService,
    @Inject(MAT_DIALOG_DATA) public category: Category
  ) { }

  ngOnInit(): void {
  }


}
