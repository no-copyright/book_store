import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CategoryService, Category } from 'src/app/services/category.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  parentCategories: Category[] = [];
  slugExists: boolean = false;
  submitting: boolean = false;
  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', Validators.required],
      priority: [1, [Validators.required, Validators.min(0)]],
      parent_id: [''],
      type: ['BLOG', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryService.getParentCategoryOptions().subscribe({
      next: (categories) => {
        this.parentCategories = categories;
      },
      error: (error) => {
        console.error('Lỗi khi tải danh mục:', error);
        this.toastService.error('Lỗi', 'Không thể tải danh sách danh mục!');
      }
    });
    
    // Tự động tạo slug từ tên
    this.categoryForm.get('name')?.valueChanges.subscribe(name => {
      if (name) {
        const slug = this.categoryService.generateSlug(name);
        this.categoryForm.patchValue({ slug }, { emitEvent: false });
        this.checkSlugExistence(slug);
      }
    });
    
    // Kiểm tra slug khi thay đổi
    this.categoryForm.get('slug')?.valueChanges.subscribe(slug => {
      if (slug) {
        this.checkSlugExistence(slug);
      }
    });
  }

  checkSlugExistence(slug: string): void {
    this.slugExists = this.categoryService.isSlugExist(slug);
  }

  onSubmit(): void {
    if (this.categoryForm.valid && !this.slugExists) {
      this.submitting = true;
      const formValue = this.categoryForm.value;
      
      // Nếu parent_id là rỗng, gán giá trị null
      if (formValue.parent_id === '') {
        formValue.parent_id = null;
      }
      
      this.categoryService.createCategory(formValue).subscribe({
        next: (category) => {
          this.toastService.success('Thành công', `Thêm danh mục "${category.name}" thành công!`);
          this.router.navigate(['/category']);
        },
        error: (error) => {
          console.error('Lỗi khi thêm danh mục:', error);
          
          let errorMessage = 'Đã xảy ra lỗi khi thêm danh mục!';
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.status === 400) {
            errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!';
          } else if (error?.status === 409) {
            errorMessage = 'Slug đã tồn tại. Vui lòng chọn slug khác!';
          }
          
          this.toastService.error('Lỗi', errorMessage);
          this.submitting = false;
        }
      });
    } else {
      // Đánh dấu tất cả các control là đã chạm vào để hiển thị lỗi
      Object.keys(this.categoryForm.controls).forEach(key => {
        const control = this.categoryForm.get(key);
        control?.markAsTouched();
      });
      
      if (this.slugExists) {
        this.toastService.warning('Cảnh báo', 'Slug đã tồn tại. Vui lòng chọn slug khác!');
      } else {
        this.toastService.warning('Cảnh báo', 'Vui lòng kiểm tra lại thông tin đã nhập!');
      }
    }
  }

  onCancel(): void {
    if (this.categoryForm.dirty) {
      this.toastService.showConfirmation(
        'Xác nhận hủy',
        'Bạn có chắc chắn muốn hủy thêm danh mục? Dữ liệu đã nhập sẽ không được lưu.',
        () => this.router.navigate(['/category']),
        () => this.toastService.info('Đã hủy', 'Tiếp tục thêm danh mục')
      );
    } else {
      this.router.navigate(['/category']);
    }
  }
  
  formatCategoryName(category: Category): string {
    const level = category.level || 0;
    return '•'.repeat(level) + (level > 0 ? ' ' : '') + category.name;
  }
}