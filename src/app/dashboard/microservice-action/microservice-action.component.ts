import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MICROSERVICE_NAME } from '../../constants/Enums';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from './../../service/dashboard.service';

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
  private progressInterval: any;

  constructor(
    private snackBar: MatSnackBar,
    private dashboardService: DashboardService
  ) {}

  handleAction(service: string, action: 'start' | 'stop' | 'restart') {
    this.isLoading = true;

    const apiCall =
      action === 'start'
        ? this.dashboardService.startService(service)
        : action === 'stop'
        ? this.dashboardService.stopService(service)
        : this.dashboardService.restartService(service);

    apiCall.subscribe({
      next: () => this.showProgress(service, action, true),
      error: () => this.showProgress(service, action, false)
    });
  }

  private showProgress(service: string, action: string, success: boolean) {
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
    }, 100); // animation speed
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
