import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../interfaces/cartItem.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 1999,
      quantity: 1,
      image: 'https://m.media-amazon.com/images/I/51xxA+6E+xL._SL1500_.jpg',
      deliveryDate: 'Get it by tomorrow',
      seller: 'Cloudtail India',
      inStock: true
    },
    {
      id: 2,
      name: 'Smart Watch with Fitness Tracker',
      price: 2499,
      quantity: 2,
      image: 'https://m.media-amazon.com/images/I/61S6Zr+3qIL._SL1500_.jpg',
      deliveryDate: 'Get it by Friday',
      seller: 'Appario Retail',
      inStock: true
    },
    {
      id: 3,
      name: 'USB Type C Cable 1m',
      price: 299,
      quantity: 1,
      image: 'https://m.media-amazon.com/images/I/61S6Zr+3qIL._SL1500_.jpg',
      deliveryDate: 'Get it by Monday',
      seller: 'ElectroMart',
      inStock: true
    }
  ];

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get deliveryFee(): number {
    return this.subtotal > 499 ? 0 : 40;
  }

  get total(): number {
    return this.subtotal + this.deliveryFee;
  }

  removeItem(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    item.quantity = newQuantity;
  }

  proceedToPayment(): void {
    // In a real app, this would navigate to payment page
    alert(`Proceeding to payment. Total amount: ₹${this.total}`);
  }
}
