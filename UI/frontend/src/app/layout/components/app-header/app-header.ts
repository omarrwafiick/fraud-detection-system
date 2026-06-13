import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {
  appTitle = input<string>('FRAUD_ARMOR');
  userDisplayName = input<string>('Omar Wafick');
  isLoggedIn = input<boolean>(false);
  logoutClick = output<void>();
  protected isMenuOpen = signal<boolean>(false);
}
