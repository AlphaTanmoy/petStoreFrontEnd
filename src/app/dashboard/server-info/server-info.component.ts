// server-info.component.ts (refactored)
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../components/path-viewer/confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subscription, timer } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../service/dashboard.service';
import { NotificationService } from '../../core/services/notification.service';

interface ServerInfo {
  osName: string;
  osVersion: string;
  ipAddress: string;
  cpu: {
    usagePercent: string;
    physicalCores: number;
    logicalCores: number;
  };
  memory: {
    totalMemoryMB: number;
    usedMemoryMB: number;
    freeMemoryMB: number;
  };
  disk: {
    totalDiskGB: number;
    usedDiskGB: number;
    freeDiskGB: number;
  };
}

@Component({
  selector: 'app-server-info',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    FormsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './server-info.component.html',
  styleUrls: ['./server-info.component.css']
})
export class ServerInfoComponent implements OnInit, OnDestroy {
  serverInfo: ServerInfo | null = null;
  isLoading = false;
  isAutoRefresh = false;
  private refreshSubscription: Subscription | null = null;

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadServerInfo();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadServerInfo(): void {
    this.isLoading = true;
    this.dashboardService.getSystemInfo().subscribe({
      next: (data) => {
        this.serverInfo = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.message || 'Failed to load server info');
      }
    });
  }

  toggleAutoRefresh(): void {
    if (this.isAutoRefresh) {
      this.stopAutoRefresh();
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          title: 'Auto Refresh',
          message: 'This will refresh server info every 10 seconds. Continue?'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.startAutoRefresh();
        }
      });
    }
  }

  private startAutoRefresh(): void {
    this.isAutoRefresh = true;
    this.refreshSubscription = timer(0, 10000).subscribe(() => {
      this.loadServerInfo();
    });
  }

  private stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
    this.isAutoRefresh = false;
  }

  private showError(message: string): void {
    this.notificationService.showError(message);
  }

  get memoryUsagePercent(): number {
    if (!this.serverInfo) return 0;
    return (this.serverInfo.memory.usedMemoryMB / this.serverInfo.memory.totalMemoryMB) * 100;
  }

  get diskUsagePercent(): number {
    if (!this.serverInfo) return 0;
    return (this.serverInfo.disk.usedDiskGB / this.serverInfo.disk.totalDiskGB) * 100;
  }
}
