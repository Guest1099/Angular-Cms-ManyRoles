import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
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

  public subcategories: Subcategory[] = [];


  constructor(
    public subcategoriesService: SubcategoriesService
  ) { }

  ngOnInit(): void {

    // wywołanie metody pobierającej subkategorie na podstawie identyfikatora id kategorii
    // do zmiennej "subcategories" gdzie zamieszczona jest w serwisie SubcategoriesService
    // zmienna ta wyświtlana jest w komponencie w pętli ngFor

    this.getAllByCategoryId(this.categoryId);
  }



  private getAllByCategoryId(categoryId: any): void {

    this.subcategoriesService.getAllByCategoryId (categoryId).subscribe({
      next: ((result: TaskResult<Subcategory[]>) => {
        if (result.success) {
          // pobranie danych
          this.subcategories = result.model as Subcategory[];
        }
        return result;
      }),
      error: (error: Error) => {
        //alert(error);
        //this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('SubcategoriesHandlerService', 'get')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
  }

}
