import { Component, OnInit, AfterViewInit, OnDestroy, Inject, ElementRef, Renderer2 } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';
import { ResponseTypeColor, type ResponseTypeColor as ResponseType } from '../../constants/commonConstants';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css']
})
export class CustomAlertComponent implements OnInit, AfterViewInit, OnDestroy {
  // Make the enum available in template
  ResponseTypeColor = ResponseTypeColor;
  textColorClass: string = 'text-success';
  buttonClass: string = 'alert-button success'; // Default class

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; text: string; type: ResponseType },
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngAfterViewInit(): void {
    // Set classes based on alert type
    switch (this.data.type) {
      case ResponseTypeColor.WARNING:
        this.textColorClass = 'text-warning';
        this.buttonClass = 'alert-button warning';
        break;
      case ResponseTypeColor.INFO:
        this.textColorClass = 'text-info';
        this.buttonClass = 'alert-button info';
        break;
      case ResponseTypeColor.ERROR:
        this.textColorClass = 'text-error';
        this.buttonClass = 'alert-button error';
        break;
      default:
        this.textColorClass = 'text-success';
        this.buttonClass = 'alert-button success';
    }

    // Apply color classes
    const titleElement = this.el.nativeElement.querySelector('#alert_header');
    const bodyElement = this.el.nativeElement.querySelector('#alert_body');
    const buttonElement = this.el.nativeElement.querySelector('#alert_button_element');

    if (titleElement) {
      this.renderer.addClass(titleElement, this.textColorClass);
    }
    if (bodyElement) {
      this.renderer.addClass(bodyElement, this.textColorClass);
    }
    if (buttonElement) {
      this.renderer.setAttribute(buttonElement, 'class', this.buttonClass);
    }
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
