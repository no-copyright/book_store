import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../constants/api.constants';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  result: {
    authenticated: boolean;
    token: string;
  };
  timestamp: string;
}

// ✅ CẬP NHẬT User interface để support multiple roles
export interface User {
  id: string;
  username: string;
  roles: string[]; // ✅ Thay đổi từ role thành roles array
  email?: string;
  profileImage?: string;
}

// ✅ THÊM JWT payload interface
export interface JWTPayload {
  sub: string;
  scope: string;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthState();
  }

  // ✅ CẬP NHẬT login method để parse multiple roles
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/identity/auth/login`, credentials).pipe(
      map(response => {
        if (response.status === 200 && response.result.authenticated) {
          localStorage.setItem('auth_token', response.result.token);
          
          // ✅ Parse JWT với multiple roles
          const payload = this.parseJWT(response.result.token);
          if (payload) {
            const user: User = {
              id: payload.sub,
              username: payload.username,
              roles: this.parseRoles(payload.scope) // ✅ Parse multiple roles từ scope
            };
            
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
            localStorage.setItem('current_user', JSON.stringify(user));
            
          }
        }
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/signin']);
  }

  // ✅ CẬP NHẬT checkAuthState với token expiration
  private checkAuthState(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');
    
    if (token && userStr) {
      if (this.isTokenExpired(token)) {
        this.logout();
        return;
      }
      
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      
    } else {
      this.logout();
    }
  }

  // ✅ CẬP NHẬT parseJWT method
  private parseJWT(token: string): JWTPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload) as JWTPayload;
      return payload;
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  // ✅ THÊM method để parse roles từ scope string
  private parseRoles(scope: string): string[] {
    if (!scope) return [];
    
    // "ROLE_USER ROLE_STAFF" -> ["USER", "STAFF"]
    return scope.split(' ')
      .filter(role => role.startsWith('ROLE_'))
      .map(role => role.replace('ROLE_', ''));
  }

  // ✅ CẬP NHẬT isTokenExpired sử dụng exp từ payload
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.parseJWT(token);
      if (!payload || !payload.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime;
      
      if (isExpired) {
      }
      
      return isExpired;
    } catch (error) {
      return true;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // ✅ THÊM role checking methods
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role.toUpperCase()) || false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user?.roles) return false;
    
    return roles.some(role => user.roles.includes(role.toUpperCase()));
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isStaff(): boolean {
    return this.hasRole('STAFF');
  }

  isUser(): boolean {
    return this.hasRole('USER');
  }

  // ✅ THÊM access control methods
  canAccessUsers(): boolean {
    return this.hasRole('ADMIN'); // Chỉ ADMIN truy cập được Users
  }

  canAccessProducts(): boolean {
    return this.hasAnyRole(['ADMIN', 'STAFF']); // ADMIN và STAFF
  }

  canAccessOrders(): boolean {
    return this.hasAnyRole(['ADMIN', 'STAFF']);
  }

  canAccessReports(): boolean {
    return this.hasRole('ADMIN');
  }

  canAccessArticles(): boolean {
    return this.hasAnyRole(['ADMIN', 'STAFF']);
  }

  canAccessCategories(): boolean {
    return this.hasAnyRole(['ADMIN', 'STAFF']);
  }

  canAccessConsultations(): boolean {
    return this.hasAnyRole(['ADMIN', 'STAFF']);
  }

  // Thêm method này nếu chưa có
  canAccessEvaluates(): boolean {
    return this.hasAnyRole(['ADMIN', 'STAFF']);
  }
}