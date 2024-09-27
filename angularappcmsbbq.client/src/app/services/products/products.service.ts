import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';
import { TaskResult } from '../../models/taskResult';
import { SnackBarService } from '../snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { GuidGenerator } from '../guid-generator';
import { InfoService } from '../InfoService';
import { MatSort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) { }

  api: string = 'https://localhost:44328/api/products';


  displayedColumns: string[] = ['lp', 'name', 'description', 'price', 'quantity', 'rozmiar', 'kolor', 'iloscOdwiedzin', 'action'];
  dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  searchFormControl = new FormControl('');


  product!: Product;
  products: Product[] = [];
  loadingElements: boolean = false;

  searchResultInformationStyle: any = {
    'display': 'none'
  }

  firstPositionStyle: any = {
    'display': 'none',
    'font-size': '30px',
    'border': '30px solid orange'
  }

  preloaderStyle: any = {
    'display': 'flex',
    'justify-content': 'center',
    'alignalign-items': 'center',
  }




  public initializeDataSource(paginator: MatPaginator, sort: MatSort): void {
    this.dataSource.paginator = paginator;
    this.dataSource.sort = sort;

    this.getAll();

    // czyszczenie kontrolki wyszukującej po odświeżeniu strony z wpisanego tekstu
    if (this.searchFormControl.dirty) {
      this.dataSource.filter = '';
      this.searchFormControl.setValue('');
    }

    this.searchResultInformationStyle.display = 'none';

  }




  public getAll(): void {
    this.http.get<any>(`${this.api}`).subscribe({
      next: ((result: TaskResult<Product[]>) => {
        if (result.success) {
          // pobranie danych
          this.dataSource.data = result.model as Product[];
          this.products = result.model as Product[];


          if (this.products.length > 0) {
            this.firstPositionStyle.display = 'none';
          } else {
            this.firstPositionStyle.display = 'block';
          }

          this.preloaderStyle.display = 'none';

        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
        }
        return result;
      }),
      error: (error: Error) => {
        //alert(error);
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('ProductsHandlerService', 'getAll')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
  }



  public get(id: any): Observable <any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

/*
  public get(id: any): Product {
    this.http.get<any>(`${this.api}/${id}`).subscribe({
      next: ((result: TaskResult<Product>) => {
        if (result.success) {
          // pobranie danych
          this.product = result.model as Product;
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
    return this.product;
  }
*/



  public create(form: FormGroup): void {

    let data = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

    let product: Product = {
      productId: GuidGenerator.newGuid().toString(),
      name: form.controls['name'].value,
      description: form.controls['description'].value,
      price: form.controls['price'].value,
      quantity: form.controls['quantity'].value,
      rozmiar: form.controls['rozmiar'].value,
      kolor: form.controls['kolor'].value,
      iloscOdwiedzin: 0,
      dataDodania: data,
      userId: '2bd20f99-1a37-4e3b-bfe4-ebad38422e6e',
      markaId: form.controls['markaId'].value,
      categoryId: form.controls['categoryId'].value,
      subcategoryId: form.controls['subcategoryId'].value,
      subsubcategoryId: form.controls['subsubcategoryId'].value
    };

    this.loadingElements = true;
    this.http.post<any>(`${this.api}`, product).subscribe({
      next: ((result: TaskResult<Product>) => {
        if (result.success) {
          this.getAll();
          this.snackBarService.setSnackBar('Nowa pozycja została dodana');
          this.loadingElements = false;
          form.reset();
          form.markAllAsTouched();
          //this.router.navigate(['/admin/products/productCreate']);
        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
          this.loadingElements = false;
        }
        return result;
      }),
      error: (error: Error) => {
        //alert(error);
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('ProductsHandlerService', 'create')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });

  }





  public edit(id: string, form: FormGroup): void {

    let product: Product = {
      productId: id,
      name: form.controls['name'].value,
      description: form.controls['description'].value,
      price: form.controls['price'].value,
      quantity: form.controls['quantity'].value,
      rozmiar: form.controls['rozmiar'].value,
      kolor: form.controls['kolor'].value,
      dataDodania: (new Date()).toString(),
      iloscOdwiedzin: 0,
      userId: '2bd20f99-1a37-4e3b-bfe4-ebad38422e6e',
      markaId: form.controls['markaId'].value,
      categoryId: form.controls['categoryId'].value,
      subcategoryId: form.controls['subcategoryId'].value,
      subsubcategoryId: form.controls['subsubcategoryId'].value,
    };

    this.loadingElements = true;
    this.http.put<any>(`${this.api}/${id}`, product).subscribe({
      next: ((result: TaskResult<Product>) => {
        if (result.success) {
          this.getAll();
          this.snackBarService.setSnackBar('Nowa pozycja została zaktualizowana');
          this.loadingElements = false;
        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
          this.loadingElements = false;
        }
        return result;
      }),
      error: (error: Error) => {
        //alert(error);
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('ProductsHandlerService', 'edit')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });
  }




  public delete(id: string): void {
    this.loadingElements = true;
    this.http.delete<any>(`${this.api}/${id}`).subscribe({
      next: ((result: TaskResult<Product>) => {
        if (result.success) {
          this.getAll();
          this.snackBarService.setSnackBar('Pozycja zostsała usunięta');
          this.loadingElements = false;
        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
          this.loadingElements = false;
        }
        return result;
      }),
      error: (error: Error) => {
        //alert(error);
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('ProductsHandlerService', 'delete')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });
  }







  public searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (this.products.length > 0 && this.dataSource.filteredData.length == 0) {
      this.searchResultInformationStyle.display = 'block';
    } else {
      this.searchResultInformationStyle.display = 'none';
    }
  }






  public isValidCreate(form: FormGroup): boolean {
    if (
      form.controls['name'].touched && form.controls['name'].dirty && form.controls['name'].valid &&
      form.controls['description'].touched && form.controls['description'].dirty && form.controls['description'].valid &&
      form.controls['price'].touched && form.controls['price'].dirty && form.controls['price'].valid &&
      form.controls['quantity'].touched && form.controls['quantity'].dirty && form.controls['quantity'].valid &&
      form.controls['rozmiar'].touched && form.controls['rozmiar'].dirty && form.controls['rozmiar'].valid &&
      form.controls['kolor'].touched && form.controls['kolor'].dirty && form.controls['kolor'].valid &&
      form.controls['markaId'].touched && form.controls['markaId'].dirty && form.controls['markaId'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }


  public isValidEdit(form: FormGroup): boolean {
    if (
      form.controls['name'].valid &&
      form.controls['description'].valid &&
      form.controls['price'].valid &&
      form.controls['quantity'].valid &&
      form.controls['rozmiar'].valid &&
      form.controls['kolor'].valid &&
      form.controls['markaId'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }



}
