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
    private route: ActivatedRoute,
    private snackBarService: SnackBarService
  ) { }


  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      let id = params.get('id');

      if (id) {

        this.subcategory = this.subcategoriesService.get(id);

        if (this.subcategory) {

          this.formGroup = this.fb.group({
            name: [this.subcategory.name, [Validators.required, Validators.minLength(2)]],
            fullName: [this.subcategory.fullName, [Validators.required, Validators.minLength(2)]],
            categoryId: [this.subcategory.categoryId, [Validators.required]]
          });

        }

        this.categoriesService.getAll();

      }
    });  
  }

}
