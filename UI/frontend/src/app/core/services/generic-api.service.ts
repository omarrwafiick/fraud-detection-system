import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class GenericApiService<T> {
  protected http = inject(HttpClient);
  
  protected abstract get basePath(): string;

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.basePath);
  }

  getById(id: string | number): Observable<T> {
    return this.http.get<T>(`${this.basePath}/${id}`);
  }

  create(item: Partial<T>): Observable<T> {
    return this.http.post<T>(this.basePath, item);
  }

  update(id: string | number, item: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.basePath}/${id}`, item);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }
}
