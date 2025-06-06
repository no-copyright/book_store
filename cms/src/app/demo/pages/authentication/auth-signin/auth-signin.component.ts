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
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // ✅ Redirect nếu đã login
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/product/list-product']);
    }
  }

  // ✅ CẬP NHẬT onSubmit method
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const credentials = this.loginForm.value;


      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          
          if (response.status === 200 && response.result.authenticated) {
            
            const user = this.authService.getCurrentUser();
            if (user) {
              
              // ✅ Kiểm tra quyền trước khi redirect
              if (this.authService.hasAnyRole(['ADMIN', 'STAFF'])) {
                this.toastService.success('Thành công', 'Đăng nhập thành công!');
                
                // ✅ Redirect đến trang sản phẩm
                setTimeout(() => {
                  this.router.navigate(['/product/list-product']).then((navigated: boolean) => {
                    if (!navigated) {
                      console.error('Navigation failed, trying alternative route');
                      this.router.navigate(['/']);
                    }
                  });
                }, 1000);
              } else {
                // ✅ User không có quyền
                this.toastService.error('Lỗi', 'Bạn không có quyền truy cập vào hệ thống quản trị!');
                this.authService.logout();
              }
            }
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
          } else if (error?.status === 403) {
            errorMessage = 'Bạn không có quyền truy cập vào hệ thống!';
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