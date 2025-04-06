import { InjectionToken } from '@angular/core';

export const BASE_URI = new InjectionToken<string>('BaseUri', {
  providedIn: 'root',
  factory: () => 'http://localhost:8741'
});