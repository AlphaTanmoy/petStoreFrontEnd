import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private hideTimeout: any;

  show() {
    // Clear any pending hide timeouts
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.isLoadingSubject.next(true);
  }

  hide() {
    // Set a minimum display time of 500ms
    this.hideTimeout = setTimeout(() => {
      this.isLoadingSubject.next(false);
      this.hideTimeout = null;
    }, 500);
  }
} 