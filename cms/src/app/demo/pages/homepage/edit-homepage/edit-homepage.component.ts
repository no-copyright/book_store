import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HomepageService, Homepage } from 'src/app/services/homepage.service';

@Component({
  selector: 'app-edit-homepage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './edit-homepage.component.html',
  styleUrls: ['./edit-homepage.component.scss']
})
export class EditHomepageComponent implements OnInit {
  homepageForm: FormGroup;
  loading = false;
  submitting = false;
  
  // Đối tượng chứa các file đã chọn
  selectedFiles: {
    banner_1?: File | null;
    banner_2?: File | null;
    banner_3?: File | null;
  } = {};
  
  // Đối tượng chứa các preview
  imagePreviews: {
    banner_1?: string;
    banner_2?: string;
    banner_3?: string;
  } = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private homepageService: HomepageService
  ) {
    this.homepageForm = this.fb.group({
      id: [1],
      banner_1: ['', Validators.required],
      banner_2: ['', Validators.required],
      banner_3: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadHomepageConfig();
  }

  loadHomepageConfig(): void {
    this.homepageService.getHomepageConfig().subscribe({
      next: (config) => {
        this.homepageForm.patchValue(config);
        
        this.imagePreviews = {
          banner_1: config.banner_1,
          banner_2: config.banner_2,
          banner_3: config.banner_3
        };
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải cấu hình trang chủ:', err);
        this.loading = false;
      }
    });
  }

  onFileChange(event: any, bannerField: string): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[bannerField as keyof typeof this.selectedFiles] = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews[bannerField as keyof typeof this.imagePreviews] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(bannerField: string): void {
    this.selectedFiles[bannerField as keyof typeof this.selectedFiles] = null;
    this.imagePreviews[bannerField as keyof typeof this.imagePreviews] = '';
    
    const control = {};
    control[bannerField] = '';
    this.homepageForm.patchValue(control);
    
    const fileInput = document.getElementById('file-' + bannerField) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.homepageForm.valid) {
      this.submitting = true;
      this.mockUploadAndSave();
    } else {
      Object.keys(this.homepageForm.controls).forEach(key => {
        const control = this.homepageForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  mockUploadAndSave(): void {
    const configToSave = this.homepageForm.value;
    
    if (this.selectedFiles.banner_1) {
      configToSave.banner_1 = 'assets/images/banner/banner-1.jpg';
    }
    
    if (this.selectedFiles.banner_2) {
      configToSave.banner_2 = 'assets/images/banner/banner-2.jpg';
    }
    
    if (this.selectedFiles.banner_3) {
      configToSave.banner_3 = 'assets/images/banner/banner-3.jpg';
    }
    
    this.homepageService.updateHomepageConfig(configToSave).subscribe({
      next: () => {
        this.submitting = false;
        alert('Cập nhật cấu hình trang chủ thành công!');
        this.router.navigate(['/homepage']);
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật cấu hình trang chủ:', err);
        this.submitting = false;
        alert('Đã xảy ra lỗi khi cập nhật cấu hình trang chủ!');
      }
    });
  }

  onCancel(): void {
    if (confirm('Bạn có chắc chắn muốn hủy những thay đổi? Các thay đổi sẽ không được lưu.')) {
      this.router.navigate(['/homepage']);
    }
  }
}