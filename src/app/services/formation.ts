import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Formation } from '../models/formation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormationService {
  private url =  `${environment.BACKEND_URL}/formations`

    constructor(private http: HttpClient) {}

  getFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.url);
  }

  save(f: Formation): Observable<Formation> {
    return this.http.post<Formation>(this.url, f);
  }

  remove(id?: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
