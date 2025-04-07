import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Admin, PaginationResponse, AdminFilterParams } from '../interfaces/admin.interface';
import { GetAPIEndpoint } from '../constants/endpoints';
import { MICROSERVICE_NAME } from '../constants/Enums';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  getAllAdmins(params: AdminFilterParams): Observable<PaginationResponse<Admin>> {
    let httpParams = new HttpParams();

    if (params.userName) httpParams = httpParams.set('userName', params.userName);
    if (params.showInActive !== undefined) httpParams = httpParams.set('showInActive', params.showInActive.toString());
    if (params.fromDate) httpParams = httpParams.set('fromDate', params.fromDate);
    if (params.toDate) httpParams = httpParams.set('toDate', params.toDate);
    if (params.dateRangeType) httpParams = httpParams.set('dateRangeType', params.dateRangeType);
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.offsetToken) httpParams = httpParams.set('offsetToken', params.offsetToken);

    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.ADMIN, 'getAllAdmins');

    return this.http.get<PaginationResponse<Admin>>(endpoint, {
      params: httpParams,
      headers
    }).pipe(
      tap(response => {
        console.log('Admin list API Response:', response);
      }),
      catchError(this.handleError)
    );
  }

  toggleAdminStatus(adminId: string, isActive: boolean): Observable<any> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.ADMIN, 'toggleAdminStatus');

    return this.http.put(`${endpoint}/${adminId}`, { isActive }, { headers }).pipe(
      tap(response => {
        console.log('Toggle admin status API Response:', response);
      }),
      catchError(this.handleError)
    );
  }

  getAdminDetails(adminId: string): Observable<Admin> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.ADMIN, 'getAdminDetails');

    return this.http.get<Admin>(`${endpoint}/${adminId}`, { headers }).pipe(
      tap(response => {
        console.log('Admin details API Response:', response);
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
