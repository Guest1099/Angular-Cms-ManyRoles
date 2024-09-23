import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../../../../../services/categories/categories.service';
import { ActivatedRoute } from '@angular/router';
import { TaskResult } from '../../../../../../models/taskResult';
import { Category } from '../../../../../../models/category';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { InfoService } from '../../../../../../services/InfoService';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css'
})
export class CategoryEditComponent implements OnInit {

  formGroup!: FormGroup;
  category !: Category;

  constructor(
    private fb: FormBuilder,
    public categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService
  ) { }


  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      if (id) {

        this.category = this.categoriesService.get(id);

        if (this.category) {
          this.formGroup = this.fb.group({
            name: [this.category.name, [Validators.required, Validators.minLength(3)]],
            fullName: [this.category.fullName, [Validators.required, Validators.minLength(3)]],
          });
        }

      }
    });
  }


}
