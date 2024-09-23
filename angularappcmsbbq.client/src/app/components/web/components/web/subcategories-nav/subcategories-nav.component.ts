import { Component, Input, OnInit } from '@angular/core';
import { SubcategoriesService } from '../../../../../services/subcategories/subcategories.service';
import { Subcategory } from '../../../../../models/subcategory';
import { TaskResult } from '../../../../../models/taskResult';

@Component({
  selector: 'app-subcategories-nav',
  templateUrl: './subcategories-nav.component.html',
  styleUrl: './subcategories-nav.component.css'
})
export class SubcategoriesNavComponent implements OnInit {

  @Input() categoryId: string = '';
  @Input() categoryName: string = '';

  constructor(
    public subcategoriesService: SubcategoriesService
  ) { }

  ngOnInit(): void {

    // wywołanie metody pobierającej subkategorie na podstawie identyfikatora id kategorii
    // do zmiennej "subcategories" gdzie zamieszczona jest w serwisie SubcategoriesService
    // zmienna ta wyświtlana jest w komponencie w pętli ngFor

    this.subcategoriesService.getAllByCategoryId(this.categoryId);

  }

}
