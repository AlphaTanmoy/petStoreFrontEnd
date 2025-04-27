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
  microservices = Object.values(MICROSERVICE_NAME).filter(
    service => service !== MICROSERVICE_NAME.AUTH && service !== MICROSERVICE_NAME.CORE
  );
  isLoading = false;
  currentService = '';
  progressBlocks: {filled: boolean}[] = Array(10).fill({filled: false});
  progressMessage = 'Initializing...';
  private api_endpoint = GetAPIEndpoint(MICROSERVICE_NAME.CORE, '/microservice');
  private progressInterval: any;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  handleAction(service: string, action: 'start' | 'stop' | 'restart') {
    if (action === 'start') {
      this.startWithProgress(service);
    } else {
      this.performSimpleAction(service, action);
    }
  }

  private startWithProgress(service: string) {
    this.isLoading = true;
    this.currentService = service;
    this.progressBlocks = Array(10).fill({filled: false});
    this.progressMessage = 'Starting service...';

    // Start progress animation
    let filledBlocks = 0;
    this.progressInterval = setInterval(() => {
      if (filledBlocks < 10) {
        this.progressBlocks[filledBlocks] = {filled: true};
        filledBlocks++;
        this.progressMessage = `Progress: ${filledBlocks * 10}%`;
      } else {
        clearInterval(this.progressInterval);
      }
    }, 1000);

    // Make API call
    const url = `${this.api_endpoint}/start/${service}`;
    this.http.post(url, {}).subscribe({
      next: (response) => {
        this.completeProgress(true, service, 'start');
      },
      error: (error) => {
        this.completeProgress(false, service, 'start');
      }
    });
  }

  private performSimpleAction(service: string, action: 'stop' | 'restart') {
    this.isLoading = true;
    const url = `${this.api_endpoint}/${action}/${service}`;

    this.http.post(url, {}).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showSnackbar(`${action} successful for ${service}`, 'success');
      },
      error: (error) => {
        this.isLoading = false;
        this.showSnackbar(`${action} failed for ${service}`, 'error');
      }
    });
  }

  private completeProgress(success: boolean, service: string, action: string) {
    // Ensure all blocks are filled
    this.progressBlocks = this.progressBlocks.map(() => ({filled: true}));
    this.progressMessage = success ? 'Completed successfully!' : 'Failed to start';

    // Clear interval if still running
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }

    // Wait a moment before hiding
    setTimeout(() => {
      this.isLoading = false;
      this.showSnackbar(
        `${action} ${success ? 'successful' : 'failed'} for ${service}`,
        success ? 'success' : 'error'
      );
    }, 1000);
  }

  private showSnackbar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    });
  }

  ngOnDestroy() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}
