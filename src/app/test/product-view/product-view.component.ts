import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Product } from '../../interfaces/product.interface';

export interface FilterOption {
  field: string;
  value: any;
}

export interface PaginationResponse<T> {
  data: T[];
  offsetToken: string;
  recordCount: number;
  filterUsed: FilterOption[];
}

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  offsetToken = '';
  recordCount = 0;

  // Filter options
  filters = {
    color: [] as string[],
    company: [] as string[],
    minPrice: 0,
    maxPrice: 10000,
    availability: false,
    deliveryTime: '',
    minRating: 0,
    sortBy: 'popularity' // 'price-low', 'price-high', 'rating', 'popularity'
  };

  // Available filter values
  availableColors: string[] = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'];
  availableCompanies: string[] = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Apple', 'Samsung'];
  deliveryTimes: string[] = ['1 day', '2 days', '3-5 days', '1 week'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    // In a real app, you would make an HTTP request here
    // this.http.get<PaginationResponse<Product>>('/api/products', { params: this.buildParams() })
    //   .subscribe(response => {
    //     this.products = response.data;
    //     this.filteredProducts = [...this.products];
    //     this.offsetToken = response.offsetToken;
    //     this.recordCount = response.recordCount;
    //     this.isLoading = false;
    //     this.applyFilters();
    //   });

    // Mock data for demonstration
    setTimeout(() => {
      this.products = this.generateMockProducts();
      this.filteredProducts = [...this.products];
      this.isLoading = false;
      this.applyFilters();
    }, 1000);
  }

  applyFilters(): void {
    let result = [...this.products];

    // Color filter
    if (this.filters.color.length > 0) {
      result = result.filter(p => this.filters.color.includes(p.color));
    }

    // Company filter
    if (this.filters.company.length > 0) {
      result = result.filter(p => this.filters.company.includes(p.company));
    }

    // Price range filter
    result = result.filter(p => p.price >= this.filters.minPrice && p.price <= this.filters.maxPrice);

    // Availability filter
    if (this.filters.availability) {
      result = result.filter(p => p.availability);
    }

    // Delivery time filter
    if (this.filters.deliveryTime) {
      result = result.filter(p => p.deliveryTime === this.filters.deliveryTime);
    }

    // Rating filter
    result = result.filter(p => p.rating >= this.filters.minRating);

    // Sorting
    switch (this.filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        result.sort((a, b) => b.popularity - a.popularity);
    }

    this.filteredProducts = result;
  }

  toggleColorFilter(color: string): void {
    const index = this.filters.color.indexOf(color);
    if (index === -1) {
      this.filters.color.push(color);
    } else {
      this.filters.color.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleCompanyFilter(company: string): void {
    const index = this.filters.company.indexOf(company);
    if (index === -1) {
      this.filters.company.push(company);
    } else {
      this.filters.company.splice(index, 1);
    }
    this.applyFilters();
  }

  resetFilters(): void {
    this.filters = {
      color: [],
      company: [],
      minPrice: 0,
      maxPrice: 10000,
      availability: false,
      deliveryTime: '',
      minRating: 0,
      sortBy: 'popularity'
    };
    this.applyFilters();
  }

  private generateMockProducts(): Product[] {
    const mockProducts: Product[] = [];
    const colors = ['Red', 'Blue', 'Green', 'Black', 'White'];
    const companies = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Apple', 'Samsung'];
    const deliveryTimes = ['1 day', '2 days', '3-5 days', '1 week'];

    for (let i = 1; i <= 20; i++) {
      mockProducts.push({
        id: `prod-${i}`,
        name: `Product ${i}`,
        price: Math.floor(Math.random() * 900) + 100,
        actualPrice: Math.floor(Math.random() * 1000) + 100,
        imageUrls: ['https://via.placeholder.com/150'],
        color: colors[Math.floor(Math.random() * colors.length)],
        company: companies[Math.floor(Math.random() * companies.length)],
        availability: Math.random() > 0.3,
        deliveryTime: deliveryTimes[Math.floor(Math.random() * deliveryTimes.length)],
        rating: Math.floor(Math.random() * 5) + 1,
        popularity: Math.floor(Math.random() * 100)
      });
    }

    return mockProducts;
  }
}
