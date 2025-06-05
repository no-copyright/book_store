import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CategoryService, Category } from 'src/app/services/category.service';
import { ToastService } from 'src/app/services/toast.service'; // ✅ Import ToastService

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss'
})
export class EditCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  categoryId: string;
  parentCategories: Category[] = [];
  filteredParentCategories: Category[] = [];
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';
    
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: [''],
      priority: [1, [Validators.required, Validators.min(0)]],
      type: ['BLOG', Validators.required],
      parent_id: ['']
    });
  }

  ngOnInit(): void {
    this.loading = true;
    
    // Lấy thông tin danh mục cần sửa
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        if (category) {
          this.categoryForm.patchValue({
            id: category.id,
            name: category.name,
            slug: category.slug,
            priority: category.priority,
            parent_id: category.parent_id || null,
            type: category.type || 'BLOG'
          });
        } else {
          this.toastService.error('Lỗi', 'Không tìm thấy danh mục!');
          this.router.navigate(['/category']);
        }
        
        // Lấy danh sách danh mục để hiển thị trong dropdown
        this.categoryService.getParentCategoryOptions().subscribe({
          next: (categories) => {
            this.parentCategories = categories;
            this.filteredParentCategories = this.parentCategories.filter(c => 
              this.categoryService.canBeParent(this.categoryId, c.id.toString())
            );
            
            this.loading = false;
          },
          error: (error) => {
            console.error('Lỗi khi tải danh mục:', error);
            this.toastService.error('Lỗi', 'Không thể tải danh sách danh mục!');
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Lỗi khi tải dữ liệu danh mục:', error);
        this.toastService.error('Lỗi', 'Đã xảy ra lỗi khi tải thông tin danh mục!');
        this.loading = false;
        this.router.navigate(['/category']);
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
      
      this.categoryService.updateCategory(formValue).subscribe({
        next: (success) => {
          if (success) {
            this.toastService.success('Thành công', `Cập nhật danh mục "${formValue.name}" thành công!`);
            this.router.navigate(['/category']);
          } else {
            this.toastService.error('Lỗi', 'Không tìm thấy danh mục để cập nhật!');
            this.submitting = false;
          }
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật danh mục:', error);
          
          let errorMessage = 'Đã xảy ra lỗi khi cập nhật danh mục!';
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.status === 400) {
            errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!';
          } else if (error?.status === 404) {
            errorMessage = 'Danh mục không tồn tại!';
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
        'Bạn có chắc chắn muốn hủy chỉnh sửa? Những thay đổi sẽ không được lưu.',
        () => this.router.navigate(['/category']),
        () => this.toastService.info('Đã hủy', 'Tiếp tục chỉnh sửa danh mục')
      );
    } else {
      this.router.navigate(['/category']);
    }
  }
}