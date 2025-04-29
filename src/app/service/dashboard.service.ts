import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MICROSERVICE_NAME } from '../constants/Enums';
import { GetAPIEndpoint } from '../constants/endpoints';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = GetAPIEndpoint(MICROSERVICE_NAME.CORE, '/microservice');
  private preHitterUrl = GetAPIEndpoint(MICROSERVICE_NAME.CORE, '/executePreHitter');

  constructor(private http: HttpClient) {}

  startService(service: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/start/${service}`, {});
  }

  stopService(service: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/stop/${service}`, {});
  }

  restartService(service: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/restart/${service}`, {});
  }

  getPreHitters(): Observable<any[]> {
    return this.http.get<any[]>(this.preHitterUrl);
  }

  getMvnRunners(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/mvnRunner/getAll`);
  }

  updateMvnRunner(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/mvnRunner/update`, payload);
  }

  getSystemInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/system-info`);
  }
}
