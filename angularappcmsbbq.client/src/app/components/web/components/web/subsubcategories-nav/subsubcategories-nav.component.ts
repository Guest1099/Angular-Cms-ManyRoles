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

  // zmienne pobierane z wyższego komponentu, aby móc odfiltrować dane w bazie przy pomocy metody "getAllByCategoryIdAndSubcategoryId"
  @Input() categoryId: any;
  @Input() subcategoryId: string = '';

  // dane pobierane do poniższych ziennych przekazywane są z wyższego komponentu i wyświetlane w routingu buttona znajdującym się w niższym komponencie html 
  @Input() categoryName: string = '';
  @Input() subcategoryName: string = '';

  public subsubcategories: Subsubcategory[] = [];

  constructor(
    public subsubcategoriesService: SubsubcategoriesService
  ) { }

  ngOnInit(): void {
/*
    this.subsubcategoriesService.getAll();
    this.subsubcategories = this.subsubcategoriesService.subsubcategories;

    this.subsubcategories = [];

    // przejście przez wszystkie subsubkategorie
    for (var i = 0; i < this.subsubcategories.length; i++) {
      // oraz wybranie tylko tych elementów, które należą do danej subKategorii pobranej z wyższego komponentu, który znajduje się w pętli
      if (this.subsubcategories[i].subcategoryId === this.subcategoryId) {
        this.subsubcategories.push(this.subsubcategories[i]);
      }
    }
*/

    this.getAllByCategoryIdAndSubcategoryId(this.categoryId, this.subcategoryId);
  }



  private getAllByCategoryIdAndSubcategoryId(categoryId: string, subcategoryId: string): void {
    if (categoryId.length > 0 && subcategoryId.length > 0) {
      this.subsubcategoriesService.getAllByCategoryIdAndSubcategoryId(categoryId, subcategoryId).subscribe({
        next: ((result: TaskResult<Subsubcategory[]>) => {
          if (result.success) {
            // pobranie danych
            this.subsubcategories = result.model as Subsubcategory[];

          } else {
            //this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
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


}
