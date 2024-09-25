import { Component, Input, OnInit } from '@angular/core';
import { Subsubcategory } from '../../../../../models/subsubcategory';
import { SubsubcategoriesService } from '../../../../../services/subsubcategories/subsubcategories.service';
import { TaskResult } from '../../../../../models/taskResult';

@Component({
  selector: 'app-subsubcategories-nav',
  templateUrl: './subsubcategories-nav.component.html',
  styleUrl: './subsubcategories-nav.component.css'
})
export class SubsubcategoriesNavComponent implements OnInit {

  @Input() subcategoryId: string = '';
  @Input() categoryName: string = '';
  @Input() subcategoryName: string = '';

  subsubcategories: Subsubcategory[] = [];

  constructor(
    public subsubcategoriesService: SubsubcategoriesService
  ) { }

  ngOnInit(): void {
/*
    this.subsubcategoriesService.getAll();     

    for (var i = 0; i < this.subsubcategoriesService.subsubcategories.length; i++) {
      if (this.subsubcategoriesService.subsubcategories[i].subcategoryId === this.subcategoryId) {
        this.subsubcategories.push(this.subsubcategoriesService.subsubcategories[i]);
      }
    }
*/
  }
}
