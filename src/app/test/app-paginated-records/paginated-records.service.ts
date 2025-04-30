import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationResponse, FilterOption } from '../../interfaces/paginationResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class PaginatedRecordsService {
  private baseUrl = 'http://localhost:8080/api/records';

  constructor(private http: HttpClient) {}

  getRecords(offsetToken: string, filters: FilterOption[]): Observable<PaginationResponse<any>> {
    let params = new HttpParams().set('offsetToken', offsetToken || '');

    filters.forEach((f) => {
      if (f.value !== null && f.value !== '' && f.value.length !== 0) {
        params = params.append(f.field, JSON.stringify(f.value));
      }
    });

    return this.http.get<PaginationResponse<any>>(this.baseUrl, { params });
  }
}
