import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { User } from '../../interfaces/user.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserListComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  users: User[] = [];
  loading = false;
  offsetToken: string | null = null;
  hasMore = true;
  filterParams: any = {
    limit: 20,
    showInActive: false
  };

  private searchSubject = new Subject<string>();

  constructor(private userService: UserService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filterParams.userName = value;
      this.resetAndLoad();
    });
  }

  ngOnInit(): void {
    this.loadUsers();
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

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers(this.filterParams).subscribe({
      next: (response) => {
        this.users = response.data;
        this.offsetToken = response.offsetToken;
        this.hasMore = !!response.offsetToken;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    if (!this.offsetToken) return;

    this.loading = true;
    this.filterParams.offsetToken = this.offsetToken;

    this.userService.getAllUsers(this.filterParams).subscribe({
      next: (response) => {
        this.users = [...this.users, ...response.data];
        this.offsetToken = response.offsetToken;
        this.hasMore = !!response.offsetToken;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading more users:', error);
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
    this.users = [];
    this.loadUsers();
  }

  viewUserProfile(id: string): void {
    // Implement view profile logic
  }

  toggleUserStatus(user: User): void {
    // Implement toggle status logic
  }
}
