// microservice-check.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import  {GetAPIEndpoint} from '../../constants/endpoints'
import { MICROSERVICE_NAME } from '../../constants/Enums';
@Component({
  selector: 'app-microservice-check',
  imports: [CommonModule],
  templateUrl: './microservice-check.component.html',
  styleUrls: ['./microservice-check.component.css']
})
export class MicroserviceCheckComponent implements OnInit, OnDestroy {
  microservices: any[] = [];
  private apiSubscription: Subscription | null = null;
  polling = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
    this.startPolling();
  }

 private api_endpoint = GetAPIEndpoint(MICROSERVICE_NAME.CORE,'/executePreHitter')

  fetchData() {
    this.http.get<any[]>(this.api_endpoint).subscribe(
      data => this.microservices = data,
      error => console.error('API Error:', error)
    );
  }

  startPolling() {
    this.apiSubscription = interval(60000).subscribe(() => {
      if (this.polling) this.fetchData();
    });
  }

  togglePolling() {
    this.polling = !this.polling;
    if (this.polling) this.fetchData();
  }

  ngOnDestroy() {
    this.apiSubscription?.unsubscribe();
  }

  calculateUptime(timeStamp: boolean[]): number {
    if (!timeStamp || timeStamp.length === 0) return 0;
    const total = timeStamp.length;
    const upCount = timeStamp.filter(x => x).length;
    return Math.round((upCount / total) * 100);
  }

}
