import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // ✅ Kiểm tra authentication
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/signin']);
      return false;
    }

    // ✅ Kiểm tra quyền truy cập admin panel
    if (!this.authService.hasAnyRole(['ADMIN', 'STAFF'])) {
      console.error('Access denied - user role not allowed');
      this.authService.logout();
      return false;
    }

    // ✅ Kiểm tra quyền cụ thể cho từng module
    const url = state.url;
    
    if (url.includes('/users') && !this.authService.canAccessUsers()) {
      console.error('Access denied - cannot access users module');
      this.router.navigate(['/product/list-product']);
      return false;
    }

    return true;
  }
}