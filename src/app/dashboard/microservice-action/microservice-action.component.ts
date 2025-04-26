import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_NAME } from '../../constants/Enums';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-microservice-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './microservice-action.component.html',
  styleUrls: ['./microservice-action.component.css']
})
export class MicroserviceActionComponent {

  microservices = Object.values(MICROSERVICE_NAME);
  isLoading = false;

  constructor(private http: HttpClient) {}

  handleAction(service: string, action: 'start' | 'stop' | 'restart') {
    this.isLoading = true;

    let url = '';
    if (action === 'start') {
      url = `/microservice/start/${service}`;
    } else if (action === 'stop') {
      url = `/microservice/stop/${service}`;
    } else if (action === 'restart') {
      url = `/microservice/restart/${service}`;
    }

    // Now call your API using HttpClient
    this.http.get(url).subscribe({
      next: (response) => {
        console.log(`${action} successful`, response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error(`${action} failed`, error);
        this.isLoading = false;
      }
    });
  }
}
