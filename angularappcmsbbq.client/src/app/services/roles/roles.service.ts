import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { ApplicationRole } from '../../models/applicationRole';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SnackBarService } from '../snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskResult } from '../../models/taskResult';
import { InfoService } from '../InfoService';
import { GuidGenerator } from '../guid-generator';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) { }

  api: string = 'https://localhost:44328/api/roles';


  displayedColumns: string[] = ['lp', 'name', 'action'];
  dataSource = new MatTableDataSource<ApplicationRole>();

  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  private rolesMap: Map<string, string> = new Map<string, string>();

  searchFormControl = new FormControl('');

  role !: ApplicationRole;
  roles: ApplicationRole[] = [];
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
      next: ((result: TaskResult<ApplicationRole[]>) => {
        if (result.success) {
          // pobranie danych
          this.dataSource.data = result.model as ApplicationRole[];
          this.roles = result.model as ApplicationRole[];

          result.model.forEach((f: ApplicationRole) => {
            this.rolesMap.set(f.id, f.name);
          });

          if (this.roles.length > 0) {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('RolesHandlerService', 'getAll')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
  }



  public getRoleName(roleId: string): string {
    return this.rolesMap.get(roleId) || '';
  }

  


  public get(id: any): Observable <any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

/*
  public get(id: any): ApplicationRole  {
    this.http.get<any>(`${this.api}/${id}`).subscribe({
      next: ((result: TaskResult<ApplicationRole>) => {
        if (result.success) {
          // pobranie danych
          this.role = result.model as ApplicationRole;
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
    return this.role;
  }
*/



  public create(form: FormGroup): void {

    let role: ApplicationRole = {
      id: GuidGenerator.newGuid().toString(),
      name: form.controls['name'].value
    };

    this.loadingElements = true;
    this.http.post<any>(`${this.api}`, role).subscribe({
      next: ((result: TaskResult<ApplicationRole>) => {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('RolesHandlerService', 'create')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });

  }




  public edit(id: string, form: FormGroup): void {

    let role: ApplicationRole = {
      id: id,
      name: form.controls['name'].value,
    };

    this.loadingElements = true;
    this.http.put<any>(`${this.api}/${id}`, role).subscribe({
      next: ((result: TaskResult<ApplicationRole>) => {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('RolesHandlerService', 'edit')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });

  }





  public delete(id: string): void {
    this.loadingElements = true;
    this.http.delete<any>(`${this.api}/${id}`).subscribe({
      next: ((result: TaskResult<ApplicationRole>) => {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('RolesHandlerService', 'delete')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });
  }





  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (this.roles.length > 0 && this.dataSource.filteredData.length == 0) {
      this.searchResultInformationStyle.display = 'block';
    } else {
      this.searchResultInformationStyle.display = 'none';
    }
  }






  public isValidCreate(form: FormGroup): boolean {
    if (
      form.controls['name'].touched && form.controls['name'].dirty && form.valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }


  public isValidEdit(form: FormGroup): boolean {
    if (
      form.valid
    ) {
      return false;
    }
    else {
      return true;
    }
  }



}
