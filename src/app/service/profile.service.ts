import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GetAPIEndpoint } from '../constants/endpoints';
import { MICROSERVICE_NAME, USER_ROLE } from '../constants/Enums';

const USER_ROLE_KEY = 'userRole';

export interface ProfileData {
  name: string;
  apiKey: string;
  userRole: string;
  tireCode: string;
  profileImage: string | null;
  dataStatus: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) { }

  private getMicroserviceByRole(userRole: string): MICROSERVICE_NAME {
    console.log('Current user role:', userRole);
    const microservice = (() => {
      switch (userRole) {
        case USER_ROLE.ROLE_ADMIN:
          return MICROSERVICE_NAME.ADMIN;
        case USER_ROLE.ROLE_MASTER:
          return MICROSERVICE_NAME.AUTH;
        case USER_ROLE.ROLE_SELLER:
          return MICROSERVICE_NAME.SELLER;
        case USER_ROLE.ROLE_DOCTOR:
          return MICROSERVICE_NAME.DOC;
        case USER_ROLE.ROLE_CUSTOMER:
          return MICROSERVICE_NAME.USER;
        case USER_ROLE.ROLE_CUSTOMER_CARE:
          return MICROSERVICE_NAME.MANAGEMENT;
        case USER_ROLE.ROLE_RAIDER:
          return MICROSERVICE_NAME.MANAGEMENT;
        default:
          throw new Error('Invalid user role');
      }
    })();
    console.log('Selected microservice:', microservice);
    return microservice;
  }

  getProfile(): Observable<ProfileData> {
    console.log('Getting profile data...');
    const token = sessionStorage.getItem('accessToken');
    const userRole = sessionStorage.getItem(USER_ROLE_KEY);

    console.log('Token exists:', !!token);
    console.log('User role from session:', userRole);

    if (!token || !userRole) {
      console.error('Missing token or user role');
      return throwError(() => new Error('No token or user role found'));
    }

    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });
    console.log('Request headers:', headers);

    try {
      const microservice = this.getMicroserviceByRole(userRole);
      const endpoint = GetAPIEndpoint(microservice, 'getProfile');

      console.log('API Call Details:');
      console.log('- Full endpoint:', endpoint);
      console.log('- Microservice:', microservice);

      return this.http.post<ProfileData>(endpoint, {}, { headers }).pipe(
        tap(response => {
          console.log('Profile API Response:', response);
          console.log('API call successful');
        }),
        catchError(this.handleError)
      );
    } catch (error) {
      console.error('Error in getProfile:', error);
      return throwError(() => error);
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error Details:');
    console.error('- Status:', error.status);
    console.error('- Status Text:', error.statusText);
    console.error('- Error:', error.error);
    console.error('- URL:', error.url);

    let errorMessage = 'Failed to load profile data. Please try again later.';

    if (error.status === 401) {
      errorMessage = 'Unauthorized access. Please log in again.';
      console.log('Unauthorized access, redirecting to login...');
      window.location.href = '/login';
    }

    return throwError(() => new Error(errorMessage));
  }
}
