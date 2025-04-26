import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_NAME } from '../../constants/Enums';
import { CommonModule } from '@angular/common';
import { GetAPIEndpoint } from '../../constants/endpoints';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private api_endpoint = GetAPIEndpoint(MICROSERVICE_NAME.CORE, '/microservice');

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  handleAction(service: string, action: 'start' | 'stop' | 'restart') {
    this.isLoading = true;
    let url = `${this.api_endpoint}/${action}/${service}`;

    this.http.post(url, {}).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open(`${action} successful for ${service}`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(`${action} failed for ${service}`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
