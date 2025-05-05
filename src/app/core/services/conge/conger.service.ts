import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conger, StatutConger } from '../../models/conge.model';
import { BASE_URL } from '../base.url';

@Injectable({
  providedIn: 'root',
})
export class CongerService {
  private CONGER_URL: string = `${BASE_URL}/conger`;

  constructor(private http: HttpClient) {}

  getAllCongers(): Observable<Conger[]> {
    return this.http.get<Conger[]>(this.CONGER_URL);
  }

  updateStatut(id: number, statut: StatutConger): Observable<Conger> {
    return this.http.put<Conger>(`${this.CONGER_URL}/updateStatut/${id}`, { statut });
  }

  addConger(conger: Conger): Observable<Conger> {
    return this.http.post<Conger>(this.CONGER_URL, conger);
  }
}
