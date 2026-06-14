import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, UserRound, LayoutDashboard, LogOut, UserPlus, ShieldUser } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {
  appTitle = input<string>('FRAUD ARMOR');
  UserIconClass = UserRound;
  LogoutIconClass = LogOut;
  LoginIconClass = ShieldUser;
  SignupIconClass = UserPlus;
  DashboardIconClass = LayoutDashboard;
  userDisplayName = input<string>('UNKNOWN');
  isLoggedIn = input<boolean>(false);
  logoutClick = output<void>();
  protected isMenuOpen = signal<boolean>(false);
}
