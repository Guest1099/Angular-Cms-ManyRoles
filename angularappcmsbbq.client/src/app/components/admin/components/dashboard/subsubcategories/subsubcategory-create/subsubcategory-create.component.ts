import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Category } from '../../../../../../models/category';
import { Subcategory } from '../../../../../../models/subcategory';
import { TaskResult } from '../../../../../../models/taskResult';
import { CategoriesService } from '../../../../../../services/categories/categories.service';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { SubcategoriesService } from '../../../../../../services/subcategories/subcategories.service';
import { MatSelectChange } from '@angular/material/select';
import { SubsubcategoriesService } from '../../../../../../services/subsubcategories/subsubcategories.service';

@Component({
  selector: 'app-subsubcategory-create',
  templateUrl: './subsubcategory-create.component.html',
  styleUrl: './subsubcategory-create.component.css'
})
export class SubsubcategoryCreateComponent implements OnInit {


  formGroup!: FormGroup;
  //categories: Category[] = [];
  subcategories: Subcategory[] = [];


  constructor(
    private fb: FormBuilder,
    public categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
    public subsubcategoriesService: SubsubcategoriesService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {


    this.getAllCategories();


    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      categoryId: ['', [Validators.required]],
      subcategoryId: ['', [Validators.required]]
    });

    this.formGroup.markAllAsTouched();
    this.formGroup.controls['subcategoryId'].disable();
         
  }

   
  getAllCategories(): void {
    this.categoriesService.getAll();
  }


  getAllSubcategoriesByCategoryId (categoryId: string): void {
    this.subcategoriesService.getAllByCategoryId(categoryId).subscribe({
      next: ((result: TaskResult<Subcategory[]>) => {
        if (result.success) {
          // pobranie danych
          let data = result.model as Subcategory[];
          this.subcategories = data.sort((a, b) => a.name.localeCompare(b.name));

          if (this.subcategories.length > 0) {
            this.formGroup.controls['subcategoryId'].enable();
          } else {
            this.formGroup.controls['subcategoryId'].disable();
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
   

  onOptionSelectedCategory(event: MatSelectChange): void {
    let category = this.categoriesService.categories.find(f => f.categoryId === event.value);
    if (category != null) {
      this.getAllSubcategoriesByCategoryId(category.categoryId);
    }
  }
   
   
}
