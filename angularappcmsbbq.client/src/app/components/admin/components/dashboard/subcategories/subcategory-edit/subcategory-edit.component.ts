import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../../../../../services/categories/categories.service';
import { SubcategoriesService } from '../../../../../../services/subcategories/subcategories.service';
import { ActivatedRoute } from '@angular/router';
import { TaskResult } from '../../../../../../models/taskResult';
import { Subcategory } from '../../../../../../models/subcategory';
import { Category } from '../../../../../../models/category';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { InfoService } from '../../../../../../services/InfoService';
import { NavigationLinkNameService } from '../../../../../../services/NavigationLinkNameService';

@Component({
  selector: 'app-subcategory-edit',
  templateUrl: './subcategory-edit.component.html',
  styleUrl: './subcategory-edit.component.css'
})
export class SubcategoryEditComponent implements OnInit {
   
  formGroup!: FormGroup;
  subcategory !: Subcategory;
  category !: Category;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    public categoriesService: CategoriesService,
    public subcategoriesService: SubcategoriesService,
    public navigationLinkNameService: NavigationLinkNameService,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService
  ) { }


  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      let id = params.get('id');

      if (id) {

        // pobranie wszystkich kategorii i wyświetlenie ich w comboBoxie
        this.categoriesService.getAll();
         

        // pobranie pojedyńczej sztuki subkategorii
        this.subcategoriesService.get(id).subscribe({
          next: ((result: TaskResult<Subcategory>) => {
            if (result.success) {
              // pobranie danych do zmiennej
              this.subcategory = result.model as Subcategory;

              // sprawdzenie czy zmienna działa
              if (this.subcategory) {

                // wyświetlenie danych w formularzu
                this.formGroup = this.fb.group({
                  name: [this.subcategory.name, [Validators.required, Validators.minLength(2)]],
                  fullName: [this.subcategory.fullName, [Validators.required, Validators.minLength(2)]],
                  categoryId: [this.subcategory.categoryId, [Validators.required]]
                });

              }
            } else {
              this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
            }
            return result;
          }),
          error: (error: Error) => {
            //alert(error);
            this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('SubcategoriesHandlerService', 'get')}. Name: ${error.name}. Message: ${error.message}`);
          }
        });
      }
    });  
  }

}
