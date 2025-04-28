import { Component, OnDestroy } from '@angular/core';
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
export class MicroserviceActionComponent implements OnDestroy {
  microservices = Object.values(MICROSERVICE_NAME).filter(
    service => service !== MICROSERVICE_NAME.AUTH && service !== MICROSERVICE_NAME.CORE
  );
  isLoading = false;
  currentService = '';
  progressBlocks: { filled: boolean }[] = Array(10).fill({ filled: false });
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
    const url = `${this.api_endpoint}/start/${service}`;

    this.http.post(url, {}).subscribe({
      next: () => {
        // After successful API call, then show progress
        this.showProgress(service, 'start', true);
      },
      error: () => {
        // Even if failed, show minimal progress then error
        this.showProgress(service, 'start', false);
      }
    });
  }

  private performSimpleAction(service: string, action: 'stop' | 'restart') {
    const url = `${this.api_endpoint}/${action}/${service}`;

    this.http.post(url, {}).subscribe({
      next: () => {
        this.showProgress(service, action, true);
      },
      error: () => {
        this.showProgress(service, action, false);
      }
    });
  }

  private showProgress(service: string, action: string, success: boolean) {
    this.isLoading = true;
    this.currentService = service;
    this.progressBlocks = Array(10).fill({ filled: false });
    this.progressMessage = 'Processing...';

    let filledBlocks = 0;
    this.progressInterval = setInterval(() => {
      if (filledBlocks < 10) {
        this.progressBlocks[filledBlocks] = { filled: true };
        filledBlocks++;
        this.progressMessage = `Progress: ${filledBlocks * 10}%`;
      } else {
        clearInterval(this.progressInterval);
        this.finishAction(service, action, success);
      }
    }, 100); // faster animation (1 second total)
  }

  private finishAction(service: string, action: string, success: boolean) {
    this.progressBlocks = this.progressBlocks.map(() => ({ filled: true }));
    this.progressMessage = success ? 'Completed successfully!' : 'Action failed!';

    setTimeout(() => {
      this.isLoading = false;
      this.showSnackbar(
        `${action} ${success ? 'successful' : 'failed'} for ${service}`,
        success ? 'success' : 'error'
      );
    }, 1000); // show final message 1s
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
