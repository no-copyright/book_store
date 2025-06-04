// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // <--- IMPORT

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()) // <--- THÊM VÀO ĐÂY
    // hoặc chỉ provideHttpClient() nếu bạn không sử dụng interceptor thông qua DI
  ]
};