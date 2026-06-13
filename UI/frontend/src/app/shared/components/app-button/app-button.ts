import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './app-button.html',
  styleUrl: './app-button.css',
})
export class AppButton {
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  variant = input<'primary' | 'secondary' | 'danger' | 'success'>('primary');
}