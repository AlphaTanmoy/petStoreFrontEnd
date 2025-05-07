import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHeart,
  faShareAlt,
  faStar,
  faStarHalfAlt,
  faChevronLeft,
  faChevronRight,
  faPlay,
  faExpand
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, FontAwesomeModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  // Icons
  faHeart = faHeart;
  faShareAlt = faShareAlt;
  faStar = faStar;
  faStarHalfAlt = faStarHalfAlt;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faPlay = faPlay;
  faExpand = faExpand;

  product: any = {
    id: '12345',
    name: 'Premium Wireless Headphones with Noise Cancellation',
    brand: 'SoundMaster',
    price: 199.99,
    actualPrice: 249.99,
    discount: 20,
    rating: 4.5,
    totalRatings: 1245,
    inStock: true,
    deliveryDate: 'Get it by tomorrow',
    colors: ['Black', 'Blue', 'Red'],
    selectedColor: 'Black',
    media: [
      { type: 'image', url: 'https://via.placeholder.com/600x600?text=Headphones+1' },
      { type: 'image', url: 'https://via.placeholder.com/600x600?text=Headphones+2' },
      { type: 'image', url: 'https://via.placeholder.com/600x600?text=Headphones+3' },
      { type: 'video', url: 'https://example.com/video-preview.mp4', thumbnail: 'https://via.placeholder.com/600x600?text=Video+Thumbnail' }
    ],
    currentMediaIndex: 0,
    zoomed: false,
    zoomLevel: 1,
    specifications: {
      general: {
        'Model Name': 'SoundMaster Pro X',
        'Model Year': '2023',
        'Product Dimensions': '18 x 15 x 7 cm'
      },
      productDetails: {
        'Connectivity': 'Bluetooth 5.0',
        'Battery Life': '30 hours',
        'Noise Cancellation': 'Yes, Active Noise Cancellation'
      },
      dimensions: {
        'Weight': '250 grams',
        'Height': '18 cm',
        'Width': '15 cm'
      },
      manufacturing: {
        'Country of Origin': 'China',
        'Manufacturer': 'SoundMaster Electronics'
      },
      packaging: {
        'Package Dimensions': '22 x 19 x 9 cm',
        'Package Weight': '500 grams'
      },
      importInfo: {
        'Imported By': 'SoundMaster India',
        'Item Weight': '250 grams'
      }
    },
    offers: [
      '10% off on Axis Bank Credit Card',
      '5% cashback on Flipkart Axis Bank Card',
      'No cost EMI starting from ₹2,000/month'
    ],
    reviews: [
      {
        user: 'John Doe',
        rating: 5,
        date: '2023-05-15',
        title: 'Excellent product!',
        comment: 'The sound quality is amazing and the noise cancellation works perfectly.'
      },
      {
        user: 'Jane Smith',
        rating: 4,
        date: '2023-04-22',
        title: 'Great headphones',
        comment: 'Very comfortable to wear for long hours. Battery life is as advertised.'
      }
    ],
    questions: [
      {
        user: 'Alex Johnson',
        date: '2023-06-10',
        question: 'Does this come with a warranty?',
        answer: 'Yes, it comes with 1 year manufacturer warranty.'
      }
    ]
  };

  newQuestion = '';
  newReview = {
    rating: 0,
    title: '',
    comment: ''
  };
  inWishlist = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // In a real app, you would fetch product details based on route parameter
    // const productId = this.route.snapshot.paramMap.get('id');
    // this.http.get(`/api/products/${productId}`).subscribe(product => {
    //   this.product = product;
    // });
  }

  selectMedia(index: number): void {
    this.product.currentMediaIndex = index;
    this.product.zoomLevel = 1;
    this.product.zoomed = false;
  }

  nextMedia(): void {
    this.product.currentMediaIndex = (this.product.currentMediaIndex + 1) % this.product.media.length;
    this.product.zoomLevel = 1;
    this.product.zoomed = false;
  }

  prevMedia(): void {
    this.product.currentMediaIndex = (this.product.currentMediaIndex - 1 + this.product.media.length) % this.product.media.length;
    this.product.zoomLevel = 1;
    this.product.zoomed = false;
  }

  zoomIn(): void {
    this.product.zoomLevel += 0.2;
    this.product.zoomed = true;
  }

  zoomOut(): void {
    if (this.product.zoomLevel > 1) {
      this.product.zoomLevel -= 0.2;
      this.product.zoomed = this.product.zoomLevel > 1;
    }
  }

  resetZoom(): void {
    this.product.zoomLevel = 1;
    this.product.zoomed = false;
  }

  toggleWishlist(): void {
    this.inWishlist = !this.inWishlist;
    // In real app, you would make API call to update wishlist
  }

  shareProduct(platform: string): void {
    const productUrl = `${window.location.origin}/products/${this.product.id}`;
    const message = `Check out this product: ${this.product.name} - ${productUrl}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'link':
        navigator.clipboard.writeText(productUrl);
        alert('Product link copied to clipboard!');
        break;
    }
  }

  submitQuestion(): void {
    if (this.newQuestion.trim()) {
      this.product.questions.unshift({
        user: 'You',
        date: new Date().toISOString().split('T')[0],
        question: this.newQuestion,
        answer: ''
      });
      this.newQuestion = '';
      // In real app, you would submit to backend
    }
  }

  submitReview(): void {
    if (this.newReview.rating > 0 && this.newReview.title.trim() && this.newReview.comment.trim()) {
      this.product.reviews.unshift({
        user: 'You',
        rating: this.newReview.rating,
        date: new Date().toISOString().split('T')[0],
        title: this.newReview.title,
        comment: this.newReview.comment
      });
      this.newReview = { rating: 0, title: '', comment: '' };
      // In real app, you would submit to backend
    }
  }

  setRating(stars: number): void {
    this.newReview.rating = stars;
  }

  getStars(rating: number): any[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill('full'),
      ...(hasHalfStar ? ['half'] : []),
      ...Array(emptyStars).fill('empty')
    ];
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
