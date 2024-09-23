import { Component, OnInit } from "@angular/core";
import { TaskResult } from "../../../../../models/taskResult";
import { CategoriesService } from "../../../../../services/categories/categories.service";
import { Category } from "../../../../../models/category";
import { Observable } from "rxjs";


@Component({
  selector: 'app-categories-nav',
  templateUrl: './categories-nav.component.html',
  styleUrl: './categories-nav.component.css'
})
export class CategoriesNavComponent implements OnInit {

  constructor(
    public categoriesService: CategoriesService,
  ) {
  }

  ngOnInit(): void {

    // wywołanie metody pobierającej wszystkie kategorie do zmiennej "categories", które
    // następnie wykorzystywane są w pętli ngFor

    this.categoriesService.getAll();
  }


}
