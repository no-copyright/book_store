import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required]] // Bỏ minLength cho password
    });
  }

  onSubmit(): void {
  if (this.loginForm.valid) {
    this.loading = true;
    const credentials = this.loginForm.value;

    console.log('Attempting login with:', credentials); // Debug log

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login response:', response); // Debug log
        this.loading = false;
        
        if (response.status === 200 && response.result.authenticated) {
          console.log('Login successful, checking auth state...'); // Debug log
          
          // Kiểm tra state sau khi đăng nhập
          console.log('Is authenticated:', this.authService.isAuthenticated()); // Debug log
          console.log('Current user:', this.authService.getCurrentUser()); // Debug log
          
          this.toastService.success('Thành công', 'Đăng nhập thành công!');
          
          // Thay đổi route redirect - chỉ navigate về /dashboard thay vì /dashboard/default
          setTimeout(() => {
            this.router.navigate(['/product/list-product']).then((navigated: boolean) => {
              console.log('Navigation result:', navigated); // Debug log
              if (!navigated) {
                console.error('Navigation failed, trying alternative route');
                // Fallback routes nếu /dashboard không hoạt động
                this.router.navigate(['/']);
              }
            });
          }, 1000);
        } else {
          this.toastService.error('Lỗi', response.message || 'Đăng nhập thất bại!');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        
        let errorMessage = 'Đã xảy ra lỗi khi đăng nhập!';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.status === 401) {
          errorMessage = 'Tài khoản hoặc mật khẩu không chính xác!';
        } else if (error?.status === 0) {
          errorMessage = 'Không thể kết nối đến server!';
        }
        
        this.toastService.error('Lỗi đăng nhập', errorMessage);
      }
    });
  } else {
    this.markFormGroupTouched();
    this.toastService.warning('Cảnh báo', 'Vui lòng kiểm tra lại thông tin đăng nhập!');
  }
}

ngOnInit(): void {
  // Nếu đã đăng nhập thì redirect về dashboard
  if (this.authService.isAuthenticated()) {
    console.log('Already authenticated, redirecting to dashboard'); // Debug log
    this.router.navigate(['/dashboard']); // Sửa từ /dashboard/default thành /dashboard
  }
}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}