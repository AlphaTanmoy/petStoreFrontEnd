import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-stack',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-stack">
      <div *ngFor="let notification of notifications" class="notification-error-stack">
        {{ notification }}
        <button class="close-btn" (click)="remove(notification)">×</button>
      </div>
    </div>
  `,
  styleUrls: ['./notification-stack.component.scss']
})
export class NotificationStackComponent {
  @Input() notifications: string[] = [];

  remove(notification: string) {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }
}
