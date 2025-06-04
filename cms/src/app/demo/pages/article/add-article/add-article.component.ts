import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-article',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './add-article.component.html',
  styleUrl: './add-article.component.scss'
})
export class AddArticleComponent implements OnInit {
  articleForm: FormGroup;
  submitting = false;
  categories: Category[] = [];
  loading = false;
  selectedFile: File | null = null; // ✅ Thêm file upload
  imagePreview: string | null = null; // ✅ Thêm preview
  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category_id: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(20)]],
      priority: [0, [Validators.required, Validators.min(0)]],
      author: ['Admin']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  // ✅ Load categories chỉ type BLOG
  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        // ✅ Filter chỉ lấy categories type BLOG
        this.categories = categories.filter(cat => cat.type === 'BLOG');
        this.loading = false;
        console.log('Loaded BLOG categories for articles:', this.categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastService.error('Lỗi', 'Không thể tải danh sách danh mục');
        this.loading = false;
        
        // ✅ Fallback categories chỉ type BLOG
        this.categories = [
          { id: '1', name: 'Tin tức', slug: 'tin-tuc', priority: 1, type: 'BLOG', level: 0, children: [] },
          { id: '2', name: 'Review sách', slug: 'review-sach', priority: 2, type: 'BLOG', level: 0, children: [] },
          { id: '3', name: 'Khuyến mãi', slug: 'khuyen-mai', priority: 3, type: 'BLOG', level: 0, children: [] },
          { id: '4', name: 'Sự kiện', slug: 'su-kien', priority: 4, type: 'BLOG', level: 0, children: [] }
        ];
      }
    });
  }

  // ✅ Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Lỗi', 'Vui lòng chọn file hình ảnh!');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('Lỗi', 'Kích thước file không được vượt quá 5MB!');
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // ✅ Remove selected image
  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    
    // Reset file input
    const fileInput = document.getElementById('thumbnailFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // ✅ Thêm method để check form validity including file
  get isFormValid(): boolean {
    return this.articleForm.valid && !!this.selectedFile;
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      // ✅ Kiểm tra file thumbnail bắt buộc
      if (!this.selectedFile) {
        this.toastService.error('Lỗi', 'Vui lòng chọn hình ảnh đại diện cho bài viết!');
        return;
      }

      this.submitting = true;
      const formData = this.articleForm.value;
      
      const articleData = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        categoryId: parseInt(formData.category_id.toString()),
        author: formData.author
      };
      
      console.log('Submitting with file:', this.selectedFile?.name); // Debug log
      
      // ✅ Đảm bảo truyền file vào service
      this.articleService.createBlog(articleData, this.selectedFile).subscribe({
        next: (newArticle) => {
          this.submitting = false;
          this.toastService.success('Thành công', 'Tạo bài viết thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/article/list-article');
          }, 1500);
        },
        error: (error) => {
          console.error('Lỗi khi tạo bài viết:', error);
          this.submitting = false;
          
          let errorMessage = 'Đã xảy ra lỗi khi tạo bài viết!';
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.status === 400) {
            errorMessage = 'Dữ liệu không hợp lệ hoặc thiếu hình ảnh!';
          }
          
          this.toastService.error('Lỗi', errorMessage);
        }
      });
    } else {
      Object.keys(this.articleForm.controls).forEach(key => {
        const control = this.articleForm.get(key);
        control?.markAsTouched();
      });
      
      this.toastService.warning('Cảnh báo', 'Vui lòng kiểm tra lại thông tin đã nhập!');
    }
  }

  onCancel(): void {
    if (this.articleForm.dirty || this.selectedFile) {
      this.toastService.showConfirmation(
        'Xác nhận hủy',
        'Bạn có chắc chắn muốn hủy tạo bài viết? Những thông tin đã nhập sẽ bị mất.',
        () => this.router.navigateByUrl('/article/list-article'),
        () => this.toastService.info('Đã hủy', 'Tiếp tục tạo bài viết')
      );
    } else {
      this.router.navigateByUrl('/article/list-article');
    }
  }
}