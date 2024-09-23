import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subcategory } from '../../../../../../models/subcategory';
import { SubcategoriesService } from '../../../../../../services/subcategories/subcategories.service';

@Component({
  selector: 'app-subcategory-delete',
  templateUrl: './subcategory-delete.component.html',
  styleUrl: './subcategory-delete.component.css'
})
export class SubcategoryDeleteComponent implements OnInit {

  constructor(
    public subcategoriesService: SubcategoriesService,
    @Inject(MAT_DIALOG_DATA) public subcategory: Subcategory
  ) { }

  ngOnInit(): void {
  }


}
