import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../../../../../services/categories/categories.service';
import { ActivatedRoute } from '@angular/router';
import { TaskResult } from '../../../../../../models/taskResult';
import { Category } from '../../../../../../models/category';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { InfoService } from '../../../../../../services/InfoService';
import { NavigationLinkNameService } from '../../../../../../services/NavigationLinkNameService';

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
    public navigationLinkNameService: NavigationLinkNameService,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService
  ) { }


  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      if (id) {

        this.categoriesService.get(id).subscribe({
          next: ((result: TaskResult<Category>) => {
            if (result.success) {
              // pobranie danych
              this.category = result.model as Category;

              if (this.category) {
                this.formGroup = this.fb.group({
                  name: [this.category.name, [Validators.required, Validators.minLength(2)]],
                  fullName: [this.category.fullName, [Validators.required, Validators.minLength(2)]],
                });
              }

            } else {
              this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
            }
            return result;
          }),
          error: (error: Error) => {
            //alert(error);
            this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('CategoriesHandlerService', 'get')}. Name: ${error.name}. Message: ${error.message}`);
          }
        });


      }
    });
  }


}
