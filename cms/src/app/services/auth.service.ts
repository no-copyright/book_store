import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
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

export interface User {
  id: string;
  username: string;
  role: string;
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
    // Kiểm tra token khi service khởi tạo
    this.checkAuthState();
  }

  // Đăng nhập
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/identity/auth/login`, credentials).pipe(
      map(response => {
        if (response.status === 200 && response.result.authenticated) {
          // Lưu token vào localStorage
          localStorage.setItem('auth_token', response.result.token);
          
          // Parse JWT để lấy thông tin user
          const userInfo = this.parseJWT(response.result.token);
          const user: User = {
            id: userInfo.sub,
            username: userInfo.username,
            role: userInfo.scope
          };
          
          // Cập nhật state
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          
          // Lưu thông tin user
          localStorage.setItem('current_user', JSON.stringify(user));
        }
        return response;
      })
    );
  }

  // Đăng xuất
  logout(): void {
    // Xóa token và thông tin user
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    
    // Reset state
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    // Redirect về trang đăng nhập
    this.router.navigate(['/auth/signin']);
  }

  // Kiểm tra trạng thái đăng nhập
  private checkAuthState(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');
    
    if (token && userStr && !this.isTokenExpired(token)) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      // Token hết hạn hoặc không hợp lệ
      this.logout();
    }
  }

  // Parse JWT token
  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  // Kiểm tra token có hết hạn không
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.parseJWT(token);
      if (!payload || !payload.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Lấy token hiện tại
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Lấy thông tin user hiện tại
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Kiểm tra có đăng nhập không
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}