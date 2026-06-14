import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string | string[];
  data: T;
}

export abstract class GenericApiService {
  protected http = inject(HttpClient);
  
  protected abstract get basePath(): string;

  getAll<T>(): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.basePath);
  }

  getById<T>(id: string | number): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.basePath}/${id}`);
  }

  create<T>(item: Partial<T>): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.basePath, item);
  }

  update<T>(id: string | number, item: Partial<T>): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.basePath}/${id}`, item);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
