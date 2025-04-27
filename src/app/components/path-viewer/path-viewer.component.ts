import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-path-viewer',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './path-viewer.component.html',
  styleUrl: './path-viewer.component.css'
})
export class PathViewerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { path: string }) {}

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.data.path);
  }
}
