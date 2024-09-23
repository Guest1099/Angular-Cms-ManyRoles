import { Injectable, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RejestratorLogowania } from '../../models/rejestratorLogowania';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RejestratorLogowaniaService } from './rejestrator-logowania.service';
import { SnackBarService } from '../snack-bar.service';
import { TaskResult } from '../../models/taskResult';
import { FormControl, FormGroup } from '@angular/forms';
import { InfoService } from '../InfoService';
import { Guid } from 'guid-typescript';
import { GuidGenerator } from '../guid-generator';

@Injectable({
  providedIn: 'root'
})
export class RejestratorLogowaniaHandlerService {

  displayedColumns: string[] = ['lp', 'dataZalogowania', 'dataWylogowania', 'czasZalogowania', 'userId', 'action'];
  dataSource = new MatTableDataSource<RejestratorLogowania>();

  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  private usersMap: Map<string, string> = new Map<string, string>();

  searchFormControl = new FormControl('');


  rejestratorLogowania!: RejestratorLogowania;
  rejestratorLogowan: RejestratorLogowania[] = [];
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

  constructor(
    private rejestratorLogowaniaService: RejestratorLogowaniaService,
    private snackBarService: SnackBarService
  ) {
    this.getAll();
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
    this.rejestratorLogowaniaService.getAll().subscribe({
      next: ((result: TaskResult<RejestratorLogowania[]>) => {
        if (result.success) {
          // pobranie danych 
          this.dataSource.data = result.model as RejestratorLogowania[];
          this.rejestratorLogowan = result.model as RejestratorLogowania[];
           

          if (this.rejestratorLogowan.length > 0) {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('RejestratorLogowaniaHandlerService', 'getAll')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
  }




  public get(id: any): void {
    this.rejestratorLogowaniaService.get(id).subscribe({
      next: ((result: TaskResult<RejestratorLogowania>) => {
        if (result.success) {
          // pobranie danych
          this.rejestratorLogowania = result.model as RejestratorLogowania;
        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('RejestratorLogowaniaHandlerService', 'get')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
  }




/*
  public create(rejestratorLogowania: RejestratorLogowania): void {

    this.rejestratorLogowaniaService.create(rejestratorLogowania).subscribe({
      next: ((result: TaskResult<RejestratorLogowania>) => {
        if (result.success) { 
        } else {
          this.snackBarService.setSnackBar(`RejestratorLogowania błąd. ${result.message}`); 
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('ProductsHandlerService', 'create')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
    
  }
*/



  public create(userId: string): void {

    alert('create rejestratorLog');
    // pobranie danych z sesji na temat zalogowanego użytkownika, w tym przypadku datę zalogowania
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {
        let dataZalogowania = sm.dataZalogowania;
        let userId = sm.userId;

        let d = new Date();
        let dataWylogowaniaString = d.toLocaleDateString() + "T" + d.toLocaleTimeString();
        let dataWylogowania = new Date(dataWylogowaniaString);
        let compare = dataWylogowania.getTime() - dataZalogowania.getTime();
        let czasZalogowania = new Date(compare);
         

        let rejestratorLogowania: RejestratorLogowania = {
          rejestratorLogowaniaId: GuidGenerator.newGuid().toString(),
          dataZalogowania: dataZalogowania,
          dataWylogowania: dataWylogowania.toString(),
          czasZalogowania: czasZalogowania.toString(),
          userId: '19f972cf-ff54-4152-a709-d9d2c9c51843'
        };

        this.rejestratorLogowaniaService.create(rejestratorLogowania).subscribe({
          next: ((result: TaskResult<RejestratorLogowania>) => {
            if (result.success) {
              alert('utworzona rejestratorLogowania');
            } else {
              this.snackBarService.setSnackBar(`RejestratorLogowania błąd. ${result.message}`);
            }
            return result;
          }),
          error: (error: Error) => {
            this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('RejestratorLogowaniaService', 'create')}. Name: ${error.name}. Message: ${error.message}`);
          }
        });

      }
    }
  }



  // Przekształca datę np. taką "12.12.2024 10:10:10" na "new Date()"
  public changeStringDateToDate(dateString: string): Date {
    let newDate!: Date;
    let dateStringSplit = dateString.split(' ');
    if (dateStringSplit.length > 0) {
      let date = dateStringSplit[0].split('.');
      let time = dateStringSplit[1].split(':');

      let day = '';
      let month = '';
      let year = '';

      let second = '';
      let minute = '';
      let hour = '';

      if (date.length > 2) {
        day = date[0];
        month = date[1];
        year = date[2];
      }

      if (time.length > 2) {
        second = time[0];
        minute = time[1];
        hour = time[2];
      }

      newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));

    }
    return newDate;
  }



/*
  public edit(id: string, rejestratorLogowania: RejestratorLogowania): void {
    this.rejestratorLogowaniaService.edit(id, rejestratorLogowania).subscribe({
      next: ((result: TaskResult<RejestratorLogowania>) => {
        if (result.success) {
          //this.getAll();
        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('RejestratorLogowaniaHandlerService', 'edit')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
  }
*/


  public edit(id: string, rejestratorLogowania: RejestratorLogowania): void {

    // zamiana daty "12.12.2024 10:10:10" na "12.12.2024T10:10:10"
    let dataZalogowania = new Date(rejestratorLogowania.dataZalogowania.replace(" ", "T"));
    let d = new Date();
    let dataWylogowaniaString = d.toLocaleDateString() + "T" + d.toLocaleTimeString();
    let dataWylogowania = new Date(dataWylogowaniaString);
    let compare = dataWylogowania.getTime() - dataZalogowania.getTime();
    let czasZalogowania = new Date(compare);

    rejestratorLogowania.dataWylogowania = dataWylogowaniaString;
    rejestratorLogowania.czasZalogowania = czasZalogowania.toString();


    this.rejestratorLogowaniaService.edit(id, rejestratorLogowania).subscribe({
      next: ((result: TaskResult<RejestratorLogowania>) => {
        if (result.success) {
          //this.getAll();
        } else {
          this.snackBarService.setSnackBar(`Dane nie zostały załadowane. ${result.message}`);
        }
        return result;
      }),
      error: (error: Error) => {
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('RejestratorLogowaniaHandlerService', 'edit')}. Name: ${error.name}. Message: ${error.message}`);
      }
    });
  }


  /*public edit(id: string, form: FormGroup): void {

    let marka: RejestratorLogowania = {
      rejestratorLogowaniaId: id,
      dataZalogowania: form.controls['dataZalogowania'].value,
      dataWylogowania: form.controls['dataWylogowania'].value,
      userId: ''
    };

    this.loadingElements = true;
    this.rejestratorLogowaniaService.edit(id, marka).subscribe({
      next: ((result: TaskResult<RejestratorLogowania>) => {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych. ${InfoService.info('RejestratorLogowaniaHandlerService', 'edit')}. Name: ${error.name}. Message: ${error.message}`);
        this.loadingElements = false;
      }
    });
  }*/





  public delete(id: string): void {
    this.loadingElements = true;
    this.rejestratorLogowaniaService.delete(id).subscribe({
      next: ((result: TaskResult<RejestratorLogowania>) => {
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
        this.snackBarService.setSnackBar(`Brak połączenia z bazą danych or token time expired. ${InfoService.info('RejestratorLogowaniaHandlerService', 'delete')}. Name: ${error.name}. Message: ${error.message}`);
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

    if (this.rejestratorLogowan.length > 0 && this.dataSource.filteredData.length == 0) {
      this.searchResultInformationStyle.display = 'block';
    } else {
      this.searchResultInformationStyle.display = 'none';
    }

  }

  
   


}

