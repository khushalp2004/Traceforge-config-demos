import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { GlobalErrorHandler } from './core/error-handler/global-error-handler';

import TraceForge from 'usetraceforge';
import { environment } from '../environments/environment';

TraceForge.init({
  apiKey: environment.traceforgeApiKey,
  endpoint: environment.traceforgeEndpoint,
  autoCapture: true
});


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
