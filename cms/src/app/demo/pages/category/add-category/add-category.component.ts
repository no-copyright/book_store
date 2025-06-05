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
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      priority: [1, [Validators.required, Validators.min(0)]],
      type: ['BLOG', Validators.required],
      parent_id: ['']
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
  }

  formatCategoryName(category: Category): string {
    const indent = '•'.repeat(category.level || 0);
    return indent + (indent ? ' ' : '') + category.name;
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.submitting = true;
      const formValue = this.categoryForm.value;
      
      // Nếu parent_id là rỗng, gán giá trị null
      if (formValue.parent_id === '') {
        formValue.parent_id = null;
      }
      
      // Thêm logic tự động tạo slug
      const categoryData = {
        ...formValue,
        slug: this.categoryService.generateSlug(formValue.name)
      };
      
      this.categoryService.createCategory(categoryData).subscribe({
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
            errorMessage = 'Tên danh mục đã tồn tại. Vui lòng chọn tên khác!';
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
      
      this.toastService.warning('Cảnh báo', 'Vui lòng kiểm tra lại thông tin đã nhập!');
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
}