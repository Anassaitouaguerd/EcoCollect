import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { requestReducer } from './features/home/store/request.reducer';
import { provideEffects } from '@ngrx/effects';
import { RequestEffects } from './features/home/store/request.effects';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideStore({
      requests: requestReducer
    }),
    
    provideEffects([RequestEffects]),
    provideHttpClient(withFetch()) 
  ]
};
