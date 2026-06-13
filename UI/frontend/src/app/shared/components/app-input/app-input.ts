import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './app-input.html',
  styleUrl: './app-input.css',
})
export class AppInput {
  id = input<string>(`input-${Math.random().toString(36).substring(2, 9)}`);
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  value = input<string>('');
  disabled = input<boolean>(false);
  
  valueChange = output<string>();
  protected onValueChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
