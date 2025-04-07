import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, UserResponse, UserFilterParams } from '../interfaces/user.interface';
import { GetAPIEndpoint } from '../constants/endpoints';
import { MICROSERVICE_NAME } from '../constants/Enums';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUsers(params: UserFilterParams): Observable<UserResponse> {
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

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.USER, 'getAllUsers');

    return this.http.get<UserResponse>(endpoint, {
      params: httpParams,
      headers
    }).pipe(
      tap(response => {
        console.log('User list API Response:', response);
      }),
      catchError(this.handleError)
    );
  }

  toggleUserStatus(userId: string, isActive: boolean): Observable<any> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.USER, 'toggleUserStatus');

    return this.http.put(`${endpoint}/${userId}`, { isActive }, { headers }).pipe(
      tap(response => {
        console.log('Toggle user status API Response:', response);
      }),
      catchError(this.handleError)
    );
  }

  getUserDetails(userId: string): Observable<User> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.USER, 'getUserDetails');

    return this.http.get<User>(`${endpoint}/${userId}`, { headers }).pipe(
      tap(response => {
        console.log('User details API Response:', response);
      }),
      catchError(this.handleError)
    );
  }

  getUserOrders(userId: string): Observable<any> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.USER, 'getUserOrders');

    return this.http.get(`${endpoint}/${userId}/orders`, { headers }).pipe(
      tap(response => {
        console.log('User orders API Response:', response);
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
