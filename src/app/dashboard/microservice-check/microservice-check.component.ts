import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { GetAPIEndpoint } from '../../constants/endpoints';
import { MICROSERVICE_NAME } from '../../constants/Enums';

@Component({
  selector: 'app-microservice-check',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './microservice-check.component.html',
  styleUrls: ['./microservice-check.component.css']
})
export class MicroserviceCheckComponent implements OnInit, OnDestroy {
  microservices: any[] = [];
  private pollingSubscription: Subscription | null = null;
  polling = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.startPolling();
  }

  private api_endpoint = GetAPIEndpoint(MICROSERVICE_NAME.CORE, '/executePreHitter');

  fetchData() {
    this.http.get<any[]>(this.api_endpoint).subscribe({
      next: data => this.microservices = data,
      error: error => console.error('API Error:', error)
    });
  }

  startPolling() {
    // Clear existing subscription if any
    this.stopPolling();

    this.pollingSubscription = interval(10000).pipe(
      takeWhile(() => this.polling)
    ).subscribe(() => {
      this.fetchData();
    });

    // Initial fetch
    this.fetchData();
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  togglePolling() {
    this.polling = !this.polling;
    if (this.polling) {
      this.startPolling();
    } else {
      this.stopPolling();
    }
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  calculateUptime(timeStamp: boolean[]): number {
    if (!timeStamp || timeStamp.length === 0) return 0;
    const total = timeStamp.length;
    const upCount = timeStamp.filter(x => x).length;
    return Math.round((upCount / total) * 100);
  }

  getPreHitterDate(preHitterTimestamp: string): string {
    if (!preHitterTimestamp) return 'N/A';
    return preHitterTimestamp.split('T')[0];
  }

  getPreHitterTime(preHitterTimestamp: string): string {
    if (!preHitterTimestamp) return 'N/A';
    const timePart = preHitterTimestamp.split('T')[1];
    return timePart ? timePart.split('.')[0] : 'N/A';
  }

}
