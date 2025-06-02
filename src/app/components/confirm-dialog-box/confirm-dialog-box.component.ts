import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog-box',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './confirm-dialog-box.component.html',
  styleUrls: ['./confirm-dialog-box.component.css']
})
export class ConfirmDialogBoxComponent {
  confirmText = new FormControl('', [
    Validators.required,
    (control) => {
      return control.value === 'CONFIRM' ? null : { invalidConfirmation: true };
    }
  ]);

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    if (this.confirmText.value === 'CONFIRM') {
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get isConfirmDisabled(): boolean {
    return this.confirmText.value !== 'CONFIRM' || this.confirmText.invalid;
  }
}
