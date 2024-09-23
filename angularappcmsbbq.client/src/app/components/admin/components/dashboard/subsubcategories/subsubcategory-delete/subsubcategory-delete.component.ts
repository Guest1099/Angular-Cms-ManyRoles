import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subsubcategory } from '../../../../../../models/subsubcategory';
import { SubsubcategoriesService } from '../../../../../../services/subsubcategories/subsubcategories.service';

@Component({
  selector: 'app-subsubcategory-delete',
  templateUrl: './subsubcategory-delete.component.html',
  styleUrl: './subsubcategory-delete.component.css'
})/*
export class SubsubcategoryDeleteComponent implements OnInit {

  constructor(
    public subsubcategoriesService: SubsubcategoriesService,
    @Inject(MAT_DIALOG_DATA) public subsubcategory: Subsubcategory
  ) { }

  ngOnInit(): void { 
  }


}
*/

export class SubsubcategoryDeleteComponent {

}
