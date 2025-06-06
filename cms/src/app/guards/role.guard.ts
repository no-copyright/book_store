import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/signin']);
      return false;
    }

    const hasRequiredRole = this.authService.hasAnyRole(requiredRoles);
    
    if (!hasRequiredRole) {
      console.error('Access denied - insufficient roles');
      // Redirect về trang được phép truy cập
      this.router.navigate(['/product/list-product']);
      return false;
    }

    return true;
  }
}