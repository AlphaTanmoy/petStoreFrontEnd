import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  };

  notifications: string[] = [];

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      panelClass: ['notification-success']
    });
  }

  showError(message: string) {
    this.notifications.push(message);
    setTimeout(() => this.remove(message), 3000);
  }

  remove(message: string) {
    const index = this.notifications.indexOf(message);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  showInfo(message: string) {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      panelClass: ['notification-info']
    });
  }

  showWarning(message: string) {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      panelClass: ['notification-warning']
    });
  }
}
