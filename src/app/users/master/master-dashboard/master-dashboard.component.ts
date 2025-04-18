import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { MICROSERVICE_NAME } from '../../../constants/Enums';
import { GetAPIEndpoint } from '../../../constants/endpoints';
import { LoaderService } from '../../../service/loader/loader.service';
import { LoaderComponent } from '../../../components/loader/loader.component';

interface MicroserviceStatus {
  name: string;
  status: 'UP' | 'DOWN';
  timestamp: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

@Component({
  selector: 'app-master-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    LoaderComponent
  ],
  templateUrl: './master-dashboard.component.html',
  styleUrl: './master-dashboard.component.css'
})
export class MasterDashboardComponent implements OnInit, OnDestroy {
  isFetching = false;
  isLoading = false;
  private fetchSubscription: Subscription | null = null;
  microserviceStatuses: MicroserviceStatus[] = [];
  notifications: Notification[] = [];
  trafficData: any[] = []; // Will be implemented with actual traffic data

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService
  ) {
    this.loaderService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  ngOnInit() {
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.stopFetching();
  }

  loadInitialData() {
    this.loaderService.show();
    // Load initial notifications
    this.loadNotifications();
    // Load initial microservice statuses
    this.fetchMicroserviceStatuses().subscribe({
      next: (statuses) => {
        this.microserviceStatuses = statuses;
        this.loaderService.hide();
      },
      error: (error) => {
        console.error('Error loading initial data:', error);
        this.loaderService.hide();
      }
    });
  }

  toggleFetching() {
    if (this.isFetching) {
      this.stopFetching();
    } else {
      this.startFetching();
    }
  }

  private startFetching() {
    this.isFetching = true;
    this.fetchSubscription = interval(30000).pipe(
      switchMap(() => {
        this.loaderService.show();
        return this.fetchMicroserviceStatuses().pipe(
          finalize(() => this.loaderService.hide())
        );
      })
    ).subscribe({
      next: (statuses) => {
        this.microserviceStatuses = statuses;
      },
      error: (error) => {
        console.error('Error fetching microservice statuses:', error);
      }
    });
  }

  private stopFetching() {
    this.isFetching = false;
    if (this.fetchSubscription) {
      this.fetchSubscription.unsubscribe();
      this.fetchSubscription = null;
    }
  }

  private fetchMicroserviceStatuses(): Observable<MicroserviceStatus[]> {
    const endpoints = Object.values(MICROSERVICE_NAME);
    const statusPromises = endpoints.map(service =>
      this.http.get<{ status: string }>(`${GetAPIEndpoint(service, 'healthCheck')}`)
        .toPromise()
        .then(response => ({
          name: service,
          status: response?.status === 'UP' ? 'UP' as const : 'DOWN' as const,
          timestamp: new Date().toISOString()
        }))
        .catch(() => ({
          name: service,
          status: 'DOWN' as const,
          timestamp: new Date().toISOString()
        }))
    );

    return new Observable(subscriber => {
      Promise.all(statusPromises)
        .then(statuses => {
          subscriber.next(statuses);
          subscriber.complete();
        })
        .catch(error => {
          subscriber.error(error);
        });
    });
  }

  private loadNotifications() {
    this.loaderService.show();
    // Mock notifications - replace with actual API call
    setTimeout(() => {
      this.notifications = [
        {
          id: '1',
          title: 'System Update',
          message: 'New security patch available',
          timestamp: new Date().toISOString(),
          read: false
        },
        {
          id: '2',
          title: 'Maintenance',
          message: 'Scheduled maintenance in 2 hours',
          timestamp: new Date().toISOString(),
          read: false
        }
      ];
      this.loaderService.hide();
    }, 1000); // Simulating API delay
  }

  viewAllNotifications() {
    // Will be implemented to navigate to notifications page
    console.log('View all notifications clicked');
  }
}
