import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../../../../../services/categories/categories.service';
import { TaskResult } from '../../../../../../models/taskResult';
import { Category } from '../../../../../../models/category';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { SubcategoriesService } from '../../../../../../services/subcategories/subcategories.service';

@Component({
  selector: 'app-subcategory-create',
  templateUrl: './subcategory-create.component.html',
  styleUrl: './subcategory-create.component.css'
})
export class SubcategoryCreateComponent implements OnInit {

  formGroup !: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    public categoriesService: CategoriesService,
    public subcategoriesService: SubcategoriesService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void { 

    // pobranie wszystkich kategorii z "categoriesService" i wyświetlenie ich w comboBoxie
    this.categoriesService.getAll();

    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      categoryId: ['', [Validators.required]],
    });

    this.formGroup.markAllAsTouched();
  }

}
