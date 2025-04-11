import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: 'fab fa-github'
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: 'fab fa-facebook'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: 'fab fa-instagram'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: 'fab fa-linkedin'
    },
    {
      name: 'LeetCode',
      url: 'https://leetcode.com',
      icon: 'fas fa-code'
    }
  ];
} 