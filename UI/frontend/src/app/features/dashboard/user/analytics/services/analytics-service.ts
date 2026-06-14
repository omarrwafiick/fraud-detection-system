import { inject, Injectable } from '@angular/core';
import { GenericApiService } from '../../../../../core/services/generic-api.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  apiService = inject(GenericApiService);
}
