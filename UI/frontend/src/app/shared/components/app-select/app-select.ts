import { Component, input, output, signal } from '@angular/core';
import { SelectOption } from '../../types/select.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  imports: [CommonModule],
  templateUrl: './app-select.html',
  styleUrl: './app-select.css',
})
export class AppSelect {
label = input<string>('');
  placeholder = input<string>('Select an option');
  options = input<SelectOption[]>([]);
  disabled = input<boolean>(false);
  multiple = input<boolean>(false);
  selectedValues = input<any[]>([]);
  selectionChange = output<any>();

  protected isOpen = signal<boolean>(false);

  protected toggleDropdown(): void {
    if (!this.disabled()) this.isOpen.update(v => !v);
  }

  protected isSelected(option: SelectOption): boolean {
    const current = this.selectedValues();
    return this.multiple() ? current.includes(option.value) : current[0] === option.value;
  }

  protected selectOption(option: SelectOption): void {
    if (this.multiple()) {
      const current = [...this.selectedValues()];
      const index = current.indexOf(option.value);
      if (index > -1) current.splice(index, 1);
      else current.push(option.value);
      this.selectionChange.emit(current);
    } else {
      this.selectionChange.emit(option.value);
      this.isOpen.set(false);
    }
  }

  protected getSingleLabel(): string {
    const val = this.selectedValues()[0];
    return this.options().find(o => o.value === val)?.label || '';
  }

  protected getSelectedLabels(): string {
    return this.options()
      .filter(o => this.selectedValues().includes(o.value))
      .map(o => o.label)
      .join(', ');
  }
}
