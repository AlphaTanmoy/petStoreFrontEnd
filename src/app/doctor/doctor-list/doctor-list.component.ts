import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../service/doctor.service';
import { Doctor } from '../../interfaces/doctor.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DoctorListComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  doctors: Doctor[] = [];
  loading = false;
  offsetToken: string | null = null;
  hasMore = true;
  filterParams: any = {
    limit: 20,
    showInActive: false
  };

  private searchSubject = new Subject<string>();

  constructor(private doctorService: DoctorService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filterParams.userName = value;
      this.resetAndLoad();
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  ngAfterViewInit(): void {
    this.setupInfiniteScroll();
  }

  private setupInfiniteScroll(): void {
    const element = this.scrollContainer.nativeElement;
    element.addEventListener('scroll', () => {
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        if (this.hasMore && !this.loading) {
          this.loadMore();
        }
      }
    });
  }

  loadDoctors(): void {
    this.loading = true;
    this.doctorService.getAllDoctors(this.filterParams).subscribe({
      next: (response) => {
        this.doctors = response.data;
        this.offsetToken = response.offsetToken;
        this.hasMore = !!response.offsetToken;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    if (!this.offsetToken) return;

    this.loading = true;
    this.filterParams.offsetToken = this.offsetToken;

    this.doctorService.getAllDoctors(this.filterParams).subscribe({
      next: (response) => {
        this.doctors = [...this.doctors, ...response.data];
        this.offsetToken = response.offsetToken;
        this.hasMore = !!response.offsetToken;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading more doctors:', error);
        this.loading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onFilterChange(): void {
    this.resetAndLoad();
  }

  private resetAndLoad(): void {
    this.offsetToken = null;
    this.doctors = [];
    this.loadDoctors();
  }

  viewDoctorProfile(id: string): void {
    // Implement view profile logic
  }

  toggleDoctorStatus(doctor: Doctor): void {
    // Implement toggle status logic
  }
}
