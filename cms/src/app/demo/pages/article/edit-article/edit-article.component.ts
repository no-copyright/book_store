import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService, Article } from 'src/app/services/article.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.scss'
})
export class EditArticleComponent implements OnInit {
  articleForm: FormGroup;
  articleId: string;
  loading = false;
  submitting = false;
  categories: Category[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  currentThumbnail: string | null = null;
  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {
    this.articleId = this.route.snapshot.paramMap.get('id') || '';
    
    this.articleForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.minLength(5)]],
      category_id: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(20)]],
      thumbnail: [''],
      priority: [0, [Validators.required, Validators.min(0)]],
      slug: [''],
      author: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadArticleData();
    
    // Auto-generate slug when title changes
    this.articleForm.get('title')?.valueChanges.subscribe(title => {
      const currentSlug = this.articleForm.get('slug')?.value;
      if (title && (!currentSlug || this.shouldUpdateSlug(title, currentSlug))) {
        this.articleForm.patchValue({
          slug: this.articleService.generateSlug(title)
        }, { emitEvent: false });
      }
    });
  }

  // ✅ Load categories chỉ type BLOG
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        // ✅ Filter chỉ lấy categories type BLOG
        this.categories = categories.filter(cat => cat.type === 'BLOG');
        console.log('Loaded BLOG categories for articles:', this.categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastService.error('Lỗi', 'Không thể tải danh sách danh mục');
        
        // Fallback categories
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

  // ✅ Get current image for display
  getCurrentImageSrc(): string | null {
    if (this.imagePreview) {
      return this.imagePreview; // New selected image
    }
    if (this.currentThumbnail) {
      return this.currentThumbnail; // Current saved image
    }
    return null;
  }

  // ✅ Check if has image (current or new)
  hasImage(): boolean {
    return !!(this.imagePreview || this.currentThumbnail);
  }

  // ✅ Handle image error - THÊM METHOD NÀY
  onImageError(event: any): void {
    console.log('Image error occurred, setting fallback image');
    event.target.src = 'assets/images/gallery/img-gal-1.jpg'; // Fallback image
    // Hoặc nếu không có fallback image, có thể ẩn ảnh
    // event.target.style.display = 'none';
  }

  shouldUpdateSlug(title: string, slug: string): boolean {
    const newSlug = this.articleService.generateSlug(title);
    const diffRatio = this.calculateDiff(newSlug, slug);
    return diffRatio < 0.5;
  }

  calculateDiff(str1: string, str2: string): number {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 0;
    
    let diff = 0;
    for (let i = 0; i < maxLength; i++) {
      if (i >= str1.length || i >= str2.length || str1[i] !== str2[i]) {
        diff++;
      }
    }
    
    return diff / maxLength;
  }
  
  loadArticleData(): void {
    this.loading = true;
    
    this.articleService.getArticleById(this.articleId).subscribe({
      next: (article) => {
        if (article) {
          // ✅ Lưu ảnh hiện tại
          this.currentThumbnail = article.thumbnail || null;
          
          this.articleForm.patchValue({
            id: article.id,
            title: article.title,
            category_id: article.category_id,
            content: article.content,
            thumbnail: article.thumbnail,
            priority: article.priority,
            slug: article.slug,
            author: article.author || 'Admin'
          });
          
          console.log('Loaded article with thumbnail:', this.currentThumbnail);
        } else {
          this.toastService.error('Lỗi', 'Không tìm thấy bài viết!');
          this.router.navigateByUrl('/article/list-article');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu bài viết:', err);
        this.toastService.error('Lỗi', 'Đã xảy ra lỗi khi tải thông tin bài viết!');
        this.loading = false;
        this.router.navigateByUrl('/article/list-article');
      }
    });
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      this.submitting = true;
      const formData = this.articleForm.value;
      
      const articleData = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        categoryId: parseInt(formData.category_id.toString()),
        author: formData.author
      };
      
      // ✅ Call API cập nhật bài viết với file (nếu có file mới)
      this.articleService.updateBlog(this.articleId, articleData, this.selectedFile || undefined).subscribe({
        next: (updatedArticle) => {
          this.submitting = false;
          this.toastService.success('Thành công', 'Cập nhật bài viết thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/article/list-article');
          }, 1500);
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật bài viết:', error);
          this.submitting = false;
          
          let errorMessage = 'Đã xảy ra lỗi khi cập nhật bài viết!';
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.status === 404) {
            errorMessage = 'Bài viết không tồn tại!';
          } else if (error?.status === 400) {
            errorMessage = 'Dữ liệu không hợp lệ!';
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
        'Bạn có chắc chắn muốn hủy chỉnh sửa? Những thay đổi sẽ không được lưu.',
        () => this.router.navigateByUrl('/article/list-article'),
        () => this.toastService.info('Đã hủy', 'Tiếp tục chỉnh sửa bài viết')
      );
    } else {
      this.router.navigateByUrl('/article/list-article');
    }
  }
}