import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Subsubcategory } from '../../models/subsubcategory';
import { TaskResult } from '../../models/taskResult';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SnackBarService } from '../snack-bar.service';
import { FormControl, FormGroup } from '@angular/forms';
import { GuidGenerator } from '../guid-generator';
import { MatTableDataSource } from '@angular/material/table';
import { InfoService } from '../InfoService';

@Injectable({
  providedIn: 'root'
})
export class SubsubcategoriesService {

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) {
    //this.getAll();
  }

  api: string = 'https://localhost:44328/api/subsubcategories';   
   

  displayedColumns: string[] = ['lp', 'name', 'fullName', 'action'];
  dataSource = new MatTableDataSource<Subsubcategory>();

  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  searchFormControl = new FormControl('');

  subsubcategory !: Subsubcategory;
  subsubcategories: Subsubcategory[] = [];
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
      next: ((result: TaskResult<Subsubcategory[]>) => {
        if (result.success) {
          // pobranie danych

          let data = result.model as Subsubcategory[];
          this.subsubcategories = data.sort((a, b) => a.name.localeCompare(b.name));
          this.dataSource.data = this.subsubcategories;


          if (this.subsubcategories.length > 0) {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('SubsubcategoriesHandlerService', 'getAll')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
  }





  public get (id: any): Observable <any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

/*
  public get(id: any): Subsubcategory  {
    this.http.get<any>(`${this.api}/${id}`).subscribe({
      next: ((result: TaskResult<Subsubcategory>) => {
        if (result.success) {
          // pobranie danych
          this.subsubcategory = result.model as Subsubcategory;
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
    return this.subsubcategory;
  }
*/



  public getAllByCategoryIdAndSubcategoryId(categoryId: string, subcategoryId: string): Observable<any> {
    return this.http.get<any>(`${this.api}/getAllByCategoryIdAndSubcategoryId/${categoryId}/${subcategoryId}`);
  }




  public create(form: FormGroup): void {

    let subsubcategory: Subsubcategory = {
      subsubcategoryId: GuidGenerator.newGuid().toString(),
      name: form.controls['name'].value,
      fullName: form.controls['fullName'].value,
      iloscOdwiedzin: 0,
      categoryId: form.controls['categoryId'].value,
      subcategoryId: form.controls['subcategoryId'].value
    };

    this.loadingElements = true;
    this.http.post<any>(`${this.api}`, subsubcategory).subscribe({
      next: ((result: TaskResult<Subsubcategory>) => {
        if (result.success) {
          this.getAll();
          this.snackBarService.setSnackBar('Nowa pozycja została dodana');
          this.loadingElements = false;
          form.reset();
          form.markAllAsTouched();
        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
          this.loadingElements = false;
        }
        return result;
      }),
      error: (error: Error) => {
        //alert(error);
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('SubsubcategoriesHandlerService', 'create')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });

  }





  public edit(id: string, form: FormGroup): void {

    let subsubcategory: Subsubcategory = {
      subsubcategoryId: id,
      name: form.controls['name'].value,
      fullName: form.controls['fullName'].value,
      iloscOdwiedzin: 0,
      categoryId: form.controls['categoryId'].value,
      subcategoryId: form.controls['subcategoryId'].value
    };

    this.loadingElements = true;
    this.http.put<any>(`${this.api}/${id}`, subsubcategory).subscribe({
      next: ((result: TaskResult<Subsubcategory>) => {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('SubsubcategoriesHandlerService', 'edit')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });

  }




  public delete(id: string): void {
    this.loadingElements = true;
    this.http.delete<any>(`${this.api}/${id}`).subscribe({
      next: ((result: TaskResult<Subsubcategory>) => {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('SubsubcategoriesHandlerService', 'delete')}. Name: ${error.name}. Message: ${error.message}`);
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

    if (this.subsubcategories.length > 0 && this.dataSource.filteredData.length == 0) {
      this.searchResultInformationStyle.display = 'block';
    } else {
      this.searchResultInformationStyle.display = 'none';
    }
  }








  public isValidCreate(form: FormGroup): boolean {
    if (
      form.controls['name'].touched && form.controls['name'].dirty && form.controls['name'].valid &&
      form.controls['fullName'].touched && form.controls['fullName'].dirty && form.controls['fullName'].valid &&
      form.controls['categoryId'].touched && form.controls['categoryId'].dirty && form.controls['categoryId'].valid
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
      form.controls['fullName'].valid &&
      form.controls['categoryId'].valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }

}
