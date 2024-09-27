import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../../../../../services/categories/categories.service';
import { SubcategoriesService } from '../../../../../../services/subcategories/subcategories.service';
import { SubsubcategoriesService } from '../../../../../../services/subsubcategories/subsubcategories.service';
import { ActivatedRoute } from '@angular/router';
import { TaskResult } from '../../../../../../models/taskResult';
import { Subsubcategory } from '../../../../../../models/subsubcategory';
import { Category } from '../../../../../../models/category';
import { Subcategory } from '../../../../../../models/subcategory';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { map, Observable, startWith } from 'rxjs';
import { InfoService } from '../../../../../../services/InfoService';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-subsubcategory-edit',
  templateUrl: './subsubcategory-edit.component.html',
  styleUrl: './subsubcategory-edit.component.css'
})
export class SubsubcategoryEditComponent implements OnInit {

  formGroup!: FormGroup;
  subsubcategory !: Subsubcategory;
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  subsubcategories: Subsubcategory[] = [];
  //isLoading: boolean = false;
  danePobrane: boolean = false;


  constructor(
    private fb: FormBuilder,
    public categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
    public subsubcategoriesService: SubsubcategoriesService,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService
  ) { }


  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      let id = params.get('id');

      if (id) {

        this.subsubcategoriesService.get(id).subscribe({
          next: ((result: TaskResult<Subsubcategory>) => {
            if (result.success) {
              
              // pobranie danych

              this.subsubcategory = result.model as Subsubcategory;
              if (this.subsubcategory) {

                // załadowanie danych do comboBoxów
                let categoryId = this.subsubcategory.categoryId == null ? '' : this.subsubcategory.categoryId;
                let subcategoryId = this.subsubcategory.subcategoryId == null ? '' : this.subsubcategory.subcategoryId;

                this.getAllCategories();
                this.getAllSubcategoriesByCategoryId(categoryId);

                this.formGroup = this.fb.group({
                  name: [this.subsubcategory.name, [Validators.required, Validators.minLength(2)]],
                  fullName: [this.subsubcategory.fullName, [Validators.required, Validators.minLength(2)]],
                  categoryId: [categoryId, [Validators.required]],
                  subcategoryId: [subcategoryId, [Validators.required]]
                });
              }


            } else {
              this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
            }
            return result;
          }),
          error: (error: Error) => {
            //alert(error);
            this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('SubsubcategoriesHandlerService', 'get')}. Name: ${error.name}. Message: ${error.message}`);
          }
        });

      }
    });

  }





  getAllCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: ((result: TaskResult<Category[]>) => {
        if (result.success) {
          // pobranie danych
          let data = result.model as Category[];
          this.categories = data.sort((a, b) => a.name.localeCompare(b.name)); 

          if (this.categories.length > 0) {
            this.formGroup.controls['categoryId'].enable();
          } else {
            this.formGroup.controls['categoryId'].disable();
          }

        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${error.message}`);
      }
    });
  }



  getAllSubcategoriesByCategoryId(categoryId: string): void {
    this.danePobrane = false;
    this.subcategoriesService.getAllByCategoryId(categoryId).subscribe({
      next: ((result: TaskResult<Subcategory[]>) => {
        if (result.success) {
          // pobranie danych
          let data = result.model as Subcategory[];
          this.subcategories = data.sort((a, b) => a.name.localeCompare(b.name)); 

          // włącza lub wyłącza kontrolkę subcategoryId

          if (this.subcategories.length > 0) {
            this.formGroup.controls['subcategoryId'].enable();
          } else {
            this.formGroup.controls['subcategoryId'].disable();
          }

          // włącza lub wyłącza kontrolkę subsubcategoryId
          if (this.subsubcategories.length > 0) {
            this.formGroup.controls['subsubcategoryId'].enable();
          } else {
            this.formGroup.controls['subsubcategoryId'].disable();
          }

        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${error.message}`);
      }
    });
    this.danePobrane = true;
  }

  
  onSelectionChangeCategory(event: MatSelectChange): void {
    let category = this.categories.find(f => f.categoryId === event.value);
    if (category != null) {
      this.getAllSubcategoriesByCategoryId(category.categoryId);
    }
  }


}
