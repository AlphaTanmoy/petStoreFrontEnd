import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SellerService } from '../../service/seller.service';
import { Seller } from '../../interfaces/seller.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.component.html',
  styleUrls: ['./seller-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SellerListComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  sellers: Seller[] = [];
  loading = false;
  offsetToken: string | null = null;
  hasMore = true;
  filterParams: any = {
    limit: 20,
    showInActive: false
  };

  private searchSubject = new Subject<string>();

  constructor(private sellerService: SellerService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filterParams.userName = value;
      this.resetAndLoad();
    });
  }

  ngOnInit(): void {
    this.loadSellers();
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

  loadSellers(): void {
    this.loading = true;
    this.sellerService.getAllSellers(this.filterParams).subscribe({
      next: (response) => {
        this.sellers = response.data;
        this.offsetToken = response.offsetToken;
        this.hasMore = !!response.offsetToken;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sellers:', error);
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    if (!this.offsetToken) return;

    this.loading = true;
    this.filterParams.offsetToken = this.offsetToken;

    this.sellerService.getAllSellers(this.filterParams).subscribe({
      next: (response) => {
        this.sellers = [...this.sellers, ...response.data];
        this.offsetToken = response.offsetToken;
        this.hasMore = !!response.offsetToken;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading more sellers:', error);
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
    this.sellers = [];
    this.loadSellers();
  }

  viewSellerProfile(id: string): void {
    // Implement view profile logic
  }

  toggleSellerStatus(seller: Seller): void {
    // Implement toggle status logic
  }
}
