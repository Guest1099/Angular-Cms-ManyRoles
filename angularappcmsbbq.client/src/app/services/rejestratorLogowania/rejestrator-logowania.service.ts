import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RejestratorLogowania } from '../../models/rejestratorLogowania';

@Injectable({
  providedIn: 'root'
})
export class RejestratorLogowaniaService {

  constructor(
    private http: HttpClient
  ) { }

  api: string = 'https://localhost:44328/api/rejestratorLogowania';

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.api}`);
  }


  get(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }


  create(object: RejestratorLogowania): Observable<any> {
    return this.http.post<any>(`${this.api}`, object);
  }

  edit(id: string, object: RejestratorLogowania): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, object);
  }

  editInternal(id: string): Observable<any> {
    return this.http.put<any>(`${this.api}/editInternal/${id}`, null);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
}
  }
