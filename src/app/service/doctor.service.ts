import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Doctor, DoctorResponse, DoctorFilterParams } from '../interfaces/doctor.interface';
import { GetAPIEndpoint } from '../constants/endpoints';
import { MICROSERVICE_NAME } from '../constants/Enums';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  constructor(private http: HttpClient) {}

  getAllDoctors(params: DoctorFilterParams): Observable<DoctorResponse> {
    let httpParams = new HttpParams();

    if (params.userName) httpParams = httpParams.set('userName', params.userName);
    if (params.showInActive !== undefined) httpParams = httpParams.set('showInActive', params.showInActive.toString());
    if (params.dateRangeType) httpParams = httpParams.set('dateRangeType', params.dateRangeType);
    if (params.specialization) httpParams = httpParams.set('specialization', params.specialization);
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.offsetToken) httpParams = httpParams.set('offsetToken', params.offsetToken);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.DOC, 'getAllDoctors');

    return this.http.get<DoctorResponse>(endpoint, {
      params: httpParams,
      headers
    }).pipe(
      tap(response => {
        console.log('Doctor list API Response:', response);
      }),
      catchError(this.handleError)
    );
  }

  toggleDoctorStatus(doctorId: string, isActive: boolean): Observable<any> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.DOC, 'toggleDoctorStatus');

    return this.http.put(`${endpoint}/${doctorId}`, { isActive }, { headers }).pipe(
      tap(response => {
        console.log('Toggle doctor status API Response:', response);
      }),
      catchError(this.handleError)
    );
  }

  getDoctorDetails(doctorId: string): Observable<Doctor> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.DOC, 'getDoctorDetails');

    return this.http.get<Doctor>(`${endpoint}/${doctorId}`, { headers }).pipe(
      tap(response => {
        console.log('Doctor details API Response:', response);
      }),
      catchError(this.handleError)
    );
  }

  getDoctorSchedule(doctorId: string, date: string): Observable<any> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.DOC, 'getDoctorSchedule');

    return this.http.get(`${endpoint}/${doctorId}/schedule`, {
      params: new HttpParams().set('date', date),
      headers
    }).pipe(
      tap(response => {
        console.log('Doctor schedule API Response:', response);
      }),
      catchError(this.handleError)
    );
  }

  getDoctorConsultations(doctorId: string): Observable<any> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Alpha': `Bearer ${token}`
    });

    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.DOC, 'getDoctorConsultations');

    return this.http.get(`${endpoint}/${doctorId}/consultations`, { headers }).pipe(
      tap(response => {
        console.log('Doctor consultations API Response:', response);
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
