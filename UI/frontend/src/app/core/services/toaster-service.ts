import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private toastr = inject(ToastrService);

  public triggerSuccessAlert(title: string, message: string): void {
    this.toastr.success(
      title, 
      message
    );
  }

  public triggerCriticalAlert(title: string, message: string): void {
    this.toastr.error(
      message, 
      title
    );
  }
}
