// microservice-check.component.ts (refactored)
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../service/dashboard.service';

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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.startPolling();
  }

  fetchData() {
    this.dashboardService.getPreHitters().subscribe({
      next: data => this.microservices = data,
      error: error => console.error('API Error:', error)
    });
  }

  startPolling() {
    this.stopPolling();
    this.pollingSubscription = interval(10000).pipe(
      takeWhile(() => this.polling)
    ).subscribe(() => this.fetchData());

    this.fetchData(); // Initial load
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  togglePolling() {
    this.polling = !this.polling;
    this.polling ? this.startPolling() : this.stopPolling();
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
