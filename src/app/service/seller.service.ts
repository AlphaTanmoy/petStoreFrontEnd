import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Seller, SellerResponse, SellerFilterParams } from '../interfaces/seller.interface';
import { GetAPIEndpoint } from '../constants/endpoints';
import { MICROSERVICE_NAME } from '../constants/Enums';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  constructor(private http: HttpClient) {}

  getAllSellers(params: SellerFilterParams): Observable<SellerResponse> {
    let httpParams = new HttpParams();

    if (params.userName) httpParams = httpParams.set('userName', params.userName);
    if (params.showInActive !== undefined) httpParams = httpParams.set('showInActive', params.showInActive.toString());
    if (params.dateRangeType) httpParams = httpParams.set('dateRangeType', params.dateRangeType);
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.offsetToken) httpParams = httpParams.set('offsetToken', params.offsetToken);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.SELLER, 'getAllSellers');

    return this.http.get<SellerResponse>(endpoint, {
      params: httpParams,
      headers
    }).pipe(
      tap(response => {
        console.log('Seller list API Response:', response);
      }),
      catchError(this.handleError)
    );
  }

  toggleSellerStatus(sellerId: string, isActive: boolean): Observable<any> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.SELLER, 'toggleSellerStatus');

    return this.http.put(`${endpoint}/${sellerId}`, { isActive }, { headers }).pipe(
      tap(response => {
        console.log('Toggle seller status API Response:', response);
      }),
      catchError(this.handleError)
    );
  }

  getSellerDetails(sellerId: string): Observable<Seller> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.SELLER, 'getSellerDetails');

    return this.http.get<Seller>(`${endpoint}/${sellerId}`, { headers }).pipe(
      tap(response => {
        console.log('Seller details API Response:', response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error Details:');
    console.error('- Status:', error.status);
    console.error('- Status Text:', error.statusText);
    console.error('- Error:', error.error);
    console.error('- URL:', error.url);

    let errorMessage = 'An error occurred. Please try again later.';

    if (error.status === 401) {
      errorMessage = 'Unauthorized access. Please log in again.';
      console.log('Unauthorized access, redirecting to login...');
      window.location.href = '/login';
    }

    return throwError(() => new Error(errorMessage));
  }
}
