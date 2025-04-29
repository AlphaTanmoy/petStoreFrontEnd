// mvn-runner-list.component.ts (refactored)
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../components/path-viewer/confirmation-dialog.component';
import { PathViewerComponent } from '../../components/path-viewer/path-viewer.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../service/dashboard.service';

interface MvnRunner {
  id: string;
  dataStatus: string;
  createdDate: string;
  lastUpdated: string;
  savedPath: string;
  microservice: string;
  mavCreated: boolean;
  shouldCreateMaven: boolean;
}

@Component({
  selector: 'app-mvn-runner-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    MatTableModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './mvn-runner-list.component.html',
  styleUrls: ['./mvn-runner-list.component.css']
})
export class MvnRunnerListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['microservice', 'lastUpdated', 'mavCreated', 'shouldCreateMaven', 'savedPath'];
  dataSource: MvnRunner[] = [];
  isLoading = false;
  progressBlocks: { filled: boolean }[] = Array(10).fill({ filled: false });
  progressMessage = 'Initializing...';
  private progressInterval: any;
  private apiResponseStatus: 'success' | 'error' | null = null;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadMvnRunners();
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  loadMvnRunners(): void {
    this.isLoading = true;
    this.dashboardService.getMvnRunners().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showSnackBar('Failed to load MVN runners', 'error');
      }
    });
  }

  showPath(path: string): void {
    this.dialog.open(PathViewerComponent, {
      width: '600px',
      data: { path }
    });
  }

  updateMvnRunner(service: MvnRunner): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Update',
        message: `Are you sure you want to update ${service.microservice}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const payload = {
          microserviceName: service.microservice,
          shouldCreateMvn: service.shouldCreateMaven,
          mavCreated: service.mavCreated
        };
        this.apiResponseStatus = null;

        this.dashboardService.updateMvnRunner(payload).subscribe({
          next: () => this.apiResponseStatus = 'success',
          error: () => this.apiResponseStatus = 'error'
        });

        this.startProgressAnimation(service);
      }
    });
  }

  private startProgressAnimation(service: MvnRunner) {
    this.isLoading = true;
    this.progressBlocks = Array(10).fill({ filled: false });
    this.progressMessage = 'Updating...';
    let filledBlocks = 0;

    this.progressInterval = setInterval(() => {
      if (filledBlocks < 10) {
        this.progressBlocks[filledBlocks] = { filled: true };
        filledBlocks++;
        this.progressMessage = `Progress: ${filledBlocks * 10}%`;
      } else {
        clearInterval(this.progressInterval);
        this.finishUpdate(service);
      }
    }, 500);
  }

  private finishUpdate(service: MvnRunner) {
    this.progressBlocks = this.progressBlocks.map(() => ({ filled: true }));
    this.progressMessage = this.apiResponseStatus === 'success' ? 'Completed successfully!' : 'Update failed';

    setTimeout(() => {
      this.isLoading = false;
      if (this.apiResponseStatus === 'success') {
        this.showSnackBar(`${service.microservice} updated successfully`, 'success');
        this.loadMvnRunners();
      } else {
        this.showSnackBar(`Failed to update ${service.microservice}`, 'error');
      }
    }, 1000);
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    });
  }
}
