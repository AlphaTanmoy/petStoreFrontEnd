import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { GetAPIEndpoint } from '../../constants/endpoints';
import { MICROSERVICE_NAME } from '../../constants/Enums';

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
export class MvnRunnerListComponent implements OnInit {
  displayedColumns: string[] = ['microservice', 'lastUpdated', 'mavCreated', 'shouldCreateMaven', 'savedPath'];
  dataSource: MvnRunner[] = [];
  isLoading = false;
  private api_endpoint = GetAPIEndpoint(MICROSERVICE_NAME.CORE, '/microservice');

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMvnRunners();
  }

  loadMvnRunners(): void {
    this.isLoading = true;
    this.http.get<MvnRunner[]>(`${this.api_endpoint}/mvnRunner/getAll`).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.isLoading = false;
      },
      error: (error) => {
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
        this.performUpdate(service);
      } else {
        window.location.reload();
      }
    });
  }

  private performUpdate(service: MvnRunner): void {
    this.isLoading = true;

    const payload = {
      microserviceName: service.microservice,
      shouldCreateMvn: service.shouldCreateMaven,
      mavCreated: service.mavCreated
    };

    this.http.post(`${this.api_endpoint}/mvnRunner/update`, payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSnackBar(`${service.microservice} updated successfully`, 'success');
        this.loadMvnRunners();
      },
      error: (error) => {
        this.isLoading = false;
        this.showSnackBar(`Failed to update ${service.microservice}`, 'error');
      }
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    });
  }
}
