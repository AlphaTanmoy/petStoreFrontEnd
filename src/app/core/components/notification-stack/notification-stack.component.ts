import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-stack.component.html',
  styleUrls: ['./notification-stack.component.css']
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
