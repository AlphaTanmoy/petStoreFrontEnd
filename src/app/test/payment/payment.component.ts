import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  selectedPaymentMethod: string = '';
  upiId: string = '';
  selectedBank: string = '';
  petStorePayBalance: number = 5000;
  amountDue: number = 2499.99;

  // Add Funds Modal State
  showAddFundsModal: boolean = false;
  addFundsMethod: string = '';
  addFundsAmount: number = 0;
  addFundsUpiId: string = '';
  addFundsSelectedBank: string = '';

  banks: string[] = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank'];

  // Handle payment method selection
  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.closeAddFundsModal(); // Close modal when switching methods
  }

  // Open Add Funds modal
  openAddFundsModal() {
    this.showAddFundsModal = true;
    this.addFundsMethod = ''; // Reset add funds method
    this.addFundsAmount = 0;
    this.addFundsUpiId = '';
    this.addFundsSelectedBank = '';
  }

  // Close Add Funds modal
  closeAddFundsModal() {
    this.showAddFundsModal = false;
    this.addFundsMethod = '';
    this.addFundsAmount = 0;
    this.addFundsUpiId = '';
    this.addFundsSelectedBank = '';
  }

  // Select method to add funds
  selectAddFundsMethod(method: string) {
    this.addFundsMethod = method;
  }

  // Add funds to PetStorePay balance
  addFunds() {
    if (!this.addFundsMethod) {
      alert('Please select a method to add funds.');
      return;
    }

    if (this.addFundsAmount <= 0) {
      alert('Please enter a valid amount to add.');
      return;
    }

    if (this.addFundsMethod === 'upi' && !this.addFundsUpiId) {
      alert('Please enter a valid UPI ID.');
      return;
    }

    if (this.addFundsMethod === 'netbanking' && !this.addFundsSelectedBank) {
      alert('Please select a bank.');
      return;
    }

    // Simulate adding funds
    this.petStorePayBalance += this.addFundsAmount;
    alert(`₹${this.addFundsAmount.toFixed(2)} added to PetStorePay via ${this.addFundsMethod}!`);
    this.closeAddFundsModal(); // Close the modal
  }

  // Handle payment submission
  proceedToPay() {
    if (!this.selectedPaymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    if (this.selectedPaymentMethod === 'upi' && !this.upiId) {
      alert('Please enter a valid UPI ID.');
      return;
    }

    if (this.selectedPaymentMethod === 'netbanking' && !this.selectedBank) {
      alert('Please select a bank.');
      return;
    }

    if (this.selectedPaymentMethod === 'petstorepay' && this.petStorePayBalance < this.amountDue) {
      alert('Insufficient balance in PetStorePay. Please add funds.');
      return;
    }

    // Simulate payment processing
    if (this.selectedPaymentMethod === 'petstorepay') {
      this.petStorePayBalance -= this.amountDue;
    }
    alert(`Payment of ₹${this.amountDue.toFixed(2)} successful via ${this.selectedPaymentMethod}!`);
  }
}
