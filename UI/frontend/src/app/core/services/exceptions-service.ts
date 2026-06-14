import { inject, Injectable } from '@angular/core';
import { ToasterService } from './toaster-service';

@Injectable({
  providedIn: 'root',
})
export class ExceptionsService {
  toaster = inject(ToasterService)
  private readonly EXCEPTIONS = new Map<string, string>();
  public processException(key: string){
    const errorMessage = this.EXCEPTIONS.get(key);
    if(errorMessage){
      this.toaster.triggerCriticalAlert(key, errorMessage);
    }else{
      this.toaster.triggerCriticalAlert(key, "Unknown error please contact support");
    }
  }
}
