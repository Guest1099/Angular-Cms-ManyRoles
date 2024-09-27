import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkiService } from '../../../../../../services/marki/marki.service';
import { CategoriesService } from '../../../../../../services/categories/categories.service';
import { SubcategoriesService } from '../../../../../../services/subcategories/subcategories.service';
import { SubsubcategoriesService } from '../../../../../../services/subsubcategories/subsubcategories.service';
import { ProductsService } from '../../../../../../services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { TaskResult } from '../../../../../../models/taskResult';
import { Product } from '../../../../../../models/product';
import { Marka } from '../../../../../../models/marka';
import { Category } from '../../../../../../models/category';
import { Subcategory } from '../../../../../../models/subcategory';
import { Subsubcategory } from '../../../../../../models/subsubcategory';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { InfoService } from '../../../../../../services/InfoService';
import { map, Observable, startWith } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit {

  formGroup!: FormGroup;
  product !: Product;
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  subsubcategories: Subsubcategory[] = [];
   

  constructor(
    private fb: FormBuilder,
    public markiService: MarkiService,
    public categoriesService: CategoriesService,
    public subcategoriesService: SubcategoriesService,
    public subsubcategoriesService: SubsubcategoriesService,
    public productsService: ProductsService,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService
  ) { }


  ngOnInit(): void {


    this.route.paramMap.subscribe(params => {
      let id = params.get('id');

      if (id) {

        // pobranie marek i wyświetlenie ich w comboBoxie
        this.markiService.getAll();

        // pobranie kategorii i wyświetlenie ich w comboBoxie
        this.categoriesService.getAll();


        this.productsService.get(id).subscribe({
          next: ((result: TaskResult<Product>) => {
            if (result.success) {
              // pobranie danych
              this.product = result.model as Product;

              if (this.product) {

                // załadowanie danych do comboBoxów
                let markaId = this.product.markaId == null ? '' : this.product.markaId;
                let categoryId = this.product.categoryId == null ? '' : this.product.categoryId;

                if (categoryId.length > 0) {

                  let subcategoryId = this.product.subcategoryId == null ? '' : this.product.subcategoryId;;
                  let subsubcategoryId = this.product.subsubcategoryId == null ? '' : this.product.subsubcategoryId;

                   
                  this.getAllSubcategoriesByCategoryId(categoryId);

                  if (subsubcategoryId.length > 0) {
                    this.getAllSubsubcategoriesByCategoryIdAndSubcategoryId(categoryId, subcategoryId);
                  }


                  this.formGroup = this.fb.group({
                    name: [this.product.name, [Validators.required, Validators.minLength(2)]],
                    description: [this.product.description, [Validators.required]],
                    price: [this.product.price, [Validators.required, Validators.pattern(/^\d+(,\d+)?$/)]],
                    quantity: [this.product.quantity, [Validators.required, Validators.pattern(/^\d+$/)]],
                    rozmiar: [this.product.rozmiar, [Validators.required]],
                    kolor: [this.product.kolor, [Validators.required]],
                    markaId: [markaId, [Validators.required]],
                    categoryId: [categoryId, [Validators.required]],
                    subcategoryId: [subcategoryId, [Validators.required]],
                    subsubcategoryId: [subsubcategoryId, [Validators.required]],
                  });


                }
              }

            } else {
              this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
            }
            return result;
          }),
          error: (error: Error) => {
            //alert(error);
            this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('ProductsHandlerService', 'get')}. Name: ${error.name}. Message: ${error.message}`);
          }
        });
        

      }
    });
  }

   


/*
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
  }*/



  getAllSubcategoriesByCategoryId(categoryId: string): void {
    if (categoryId.length > 0) {
      this.subcategoriesService.getAllByCategoryId(categoryId).subscribe({
        next: ((result: TaskResult<Subcategory[]>) => {
          if (result.success) {
            // pobranie danych
            this.subcategories = result.model as Subcategory[];

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
          //alert(error);
          this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('SubcategoriesHandlerService', 'get')}. Name: ${error.name}. Message: ${error.message}`);
        }
      });

    }
  }




  getAllSubsubcategoriesByCategoryIdAndSubcategoryId(categoryId: string, subcategoryId: string): void {
    if (categoryId.length > 0 && subcategoryId.length > 0) {
      this.subsubcategoriesService.getAllByCategoryIdAndSubcategoryId(categoryId, subcategoryId).subscribe({
        next: ((result: TaskResult<Subsubcategory[]>) => {
          if (result.success) {
            // pobranie danych
            this.subsubcategories = result.model as Subsubcategory[];


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
          //alert(error);
          this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('SubcategoriesHandlerService', 'get')}. Name: ${error.name}. Message: ${error.message}`);
        }
      });

    }
  }



  onSelectionChangeCategory(event: MatSelectChange): void {
    let category = this.categories.find(f => f.categoryId === event.value);
    if (category != null) {
      this.getAllSubcategoriesByCategoryId(category.categoryId);

      // przypisanie wartości począktowych do drugiego comboBoxa 
      this.formGroup.controls['subcategoryId'].setValue('');
      this.formGroup.controls['subcategoryId'].markAsTouched();


      // przypisanie wartości począktowych do trzeciego comboBoxa
      this.subsubcategories = [];
      this.formGroup.controls['subsubcategoryId'].setValue('');
    }
  } 


  onSelectionChangeSubcategory(event: MatSelectChange): void {
    let subcategory = this.subcategories.find(f => f.subcategoryId === event.value);
    if (subcategory != null) {
      let categoryId = subcategory.categoryId == null ? "" : subcategory.categoryId;
      let subcategoryId = subcategory.subcategoryId;
      this.getAllSubsubcategoriesByCategoryIdAndSubcategoryId(categoryId, subcategoryId);
      this.formGroup.controls['subsubcategoryId'].markAsTouched();
    }
  }


}
