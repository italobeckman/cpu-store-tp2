import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { provideNgxStripe } from 'ngx-stripe';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './interceptors/auth.interpector';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: {} },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    // Add Stripe configuration here
    provideNgxStripe(environment.stripePublicKey)
  ]
};