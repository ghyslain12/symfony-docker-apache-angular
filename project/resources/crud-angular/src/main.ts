import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import { jwtInterceptorFn} from './app/core/interceptors/jwt.interceptor';
import {authInterceptor} from './app/core/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptorFn, authInterceptor])),
    provideAnimations(),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
