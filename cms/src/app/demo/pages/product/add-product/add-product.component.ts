import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { LoadingModalComponent } from 'src/app/theme/shared/components/loading-modal/loading-modal.component';
import { ProductService, Product } from 'src/app/services/product.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule, LoadingModalComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  submitting = false;
  selectedThumbnailFile: File | null = null;
  selectedImageFiles: File[] = [];
  imagePreview: string | null = null;
  categories: Category[] = [];
  selectedCategoryIds: string[] = [];
  showCategoryModal = false;
  
  // ✅ THÊM các properties bị thiếu
  thumbnailPreview: string | null = null;
  imagePreviews: string[] = [];
  maxImages = 5; // Giới hạn số ảnh tối đa

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      author: [''],
      publisher: ['', Validators.required],
      publicationYear: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      packageSize: [0],
      pageSize: [0],
      thumbnail: [''],
      form: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      discount: [0],
      discountPercent: [0, [Validators.min(0), Validators.max(100)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      priority: [1, [Validators.required, Validators.min(0)]],
      description: [''],
      averageRate: [0],
      active: [true],
      imageUrls: [[]],
      categories: [[]],
      createdAt: [''],
      
      // Computed fields cho compatibility
      code: [''],
      name: [''],
      image: [''],
      originalPrice: [0],
      status: ['in_stock'],
      format: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  // ✅ Load danh sách categories với hierarchy
  loadCategories(): void {
    this.categoryService.getCategoriesFlat().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Loaded categories:', categories);
      },
      error: (error) => {
        console.error('Lỗi khi tải danh mục:', error);
        this.toastService.error('Lỗi', 'Không thể tải danh sách danh mục!');
      }
    });
  }

  // ✅ Toggle category selection
  toggleCategory(categoryId: string | number): void {
    const id = categoryId.toString();
    const index = this.selectedCategoryIds.indexOf(id);
    
    if (index > -1) {
      this.selectedCategoryIds.splice(index, 1);
    } else {
      this.selectedCategoryIds.push(id);
    }
    
    // Update form control
    this.productForm.patchValue({
      categories: this.selectedCategoryIds
    });
    
    console.log('Selected category IDs:', this.selectedCategoryIds);
  }

  // ✅ Check if category is selected
  isCategorySelected(categoryId: string | number): boolean {
    return this.selectedCategoryIds.includes(categoryId.toString());
  }

  // ✅ Get selected category names for display
  getSelectedCategoryNames(): string {
    if (this.selectedCategoryIds.length === 0) {
      return 'Chưa chọn danh mục nào';
    }
    
    const selectedCategories = this.categories.filter(cat => 
      this.selectedCategoryIds.includes(cat.id.toString())
    );
    return selectedCategories.map(cat => cat.name).join(', ');
  }

  // ✅ Format category name with hierarchy
  formatCategoryName(category: Category): string {
    const level = category.level || 0;
    return '•'.repeat(level) + (level > 0 ? ' ' : '') + category.name;
  }

  // ✅ Open category selection modal
  openCategoryModal(): void {
    this.showCategoryModal = true;
  }

  // ✅ Close category selection modal
  closeCategoryModal(): void {
    this.showCategoryModal = false;
  }

  // ✅ Clear all selected categories
  clearAllCategories(): void {
    this.selectedCategoryIds = [];
    this.productForm.patchValue({
      categories: []
    });
  }

  // ✅ THÊM method để handle thumbnail file selection
  onThumbnailChange(event: any): void {
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

      this.selectedThumbnailFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.thumbnailPreview = e.target?.result as string;
        this.imagePreview = e.target?.result as string; // Giữ backward compatibility
      };
      reader.readAsDataURL(file);
      
      console.log('Thumbnail file selected:', file.name, file.size);
    }
  }

  // ✅ THÊM method removeThumbnail
  removeThumbnail(): void {
    this.selectedThumbnailFile = null;
    this.thumbnailPreview = null;
    this.imagePreview = null;
    
    // Reset file input
    const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // ✅ THÊM method onImagesChange để handle multiple images
  onImagesChange(event: any): void {
    const files = Array.from(event.target.files) as File[];
    
    if (files.length === 0) return;

    // Check total images limit
    if (this.selectedImageFiles.length + files.length > this.maxImages) {
      this.toastService.error('Lỗi', `Chỉ được chọn tối đa ${this.maxImages} ảnh!`);
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Lỗi', `File ${file.name} không phải là hình ảnh!`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('Lỗi', `File ${file.name} vượt quá 5MB!`);
        return;
      }
    }

    // Add files and create previews
    this.selectedImageFiles.push(...files);
    
    // Create previews for new files
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });

    console.log('Selected image files:', this.selectedImageFiles.length);
  }

  // ✅ CẬP NHẬT removeImage để nhận index parameter
  removeImage(index?: number): void {
    if (index !== undefined && index >= 0 && index < this.selectedImageFiles.length) {
      // Remove specific image by index
      this.selectedImageFiles.splice(index, 1);
      this.imagePreviews.splice(index, 1);
    } else {
      // Remove thumbnail (backward compatibility)
      this.removeThumbnail();
    }
  }

  // ✅ THÊM method removeAllImages
  removeAllImages(): void {
    this.selectedImageFiles = [];
    this.imagePreviews = [];
    
    // Reset file input
    const fileInput = document.getElementById('images') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    this.toastService.info('Đã xóa', 'Đã xóa tất cả ảnh trong thư viện');
  }

  // ✅ CẬP NHẬT onSubmit để sửa lỗi type
  onSubmit(): void {
    if (this.productForm.valid) {
      this.submitting = true;
      const formValue = this.productForm.value;

      // Convert selectedCategoryIds to numbers for API
      const categoryIds = this.selectedCategoryIds.map(id => parseInt(id, 10));

      const productData: Product = {
        id: 0, // ✅ SỬA: Sử dụng 0 thay vì '' cho number type
        title: formValue.title || '',
        author: formValue.author || '',
        publisher: formValue.publisher || '',
        publicationYear: Number(formValue.publicationYear) || new Date().getFullYear(),
        packageSize: Number(formValue.packageSize) || 0,
        pageSize: Number(formValue.pageSize) || 0,
        form: formValue.form || '',
        thumbnail: formValue.thumbnail || '',
        quantity: Number(formValue.quantity) || 0,
        discount: Number(formValue.discount) || 0,
        price: Number(formValue.price) || 0,
        discountPercent: Number(formValue.discountPercent) || 0,
        priority: Number(formValue.priority) || 0,
        description: formValue.description || '',
        averageRate: 0,
        active: Boolean(formValue.active),
        imageUrls: [],
        categories: categoryIds,
        createdAt: new Date().toISOString(),

        // Computed fields (sẽ bị loại bỏ trong service)
        code: '', // ✅ String type - OK
        name: formValue.title,
        image: '',
        originalPrice: Number(formValue.price),
        status: 'in_stock',
        format: formValue.form
      };

      console.log('=== ADD PRODUCT DEBUG ===');
      console.log('Product data:', productData);
      console.log('Selected thumbnail file:', this.selectedThumbnailFile?.name);
      console.log('Selected image files:', this.selectedImageFiles.length);
      console.log('Categories to send:', categoryIds);

      // ✅ Gọi API với multipart data
      this.productService.addProduct(
        productData, 
        this.selectedThumbnailFile || undefined, 
        this.selectedImageFiles.length > 0 ? this.selectedImageFiles : undefined
      ).subscribe({
        next: (newProduct) => {
          console.log('Product added successfully:', newProduct);
          this.submitting = false;
          this.toastService.success('Thành công', 'Thêm sản phẩm thành công!');
          
          setTimeout(() => {
            this.router.navigate(['/product/list-product']);
          }, 1500);
        },
        error: (error) => {
          console.error('=== ADD PRODUCT ERROR ===');
          console.error('Error details:', error);
          
          this.submitting = false;
          
          let errorMessage = 'Đã xảy ra lỗi khi thêm sản phẩm!';
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.status === 400) {
            errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!';
          } else if (error?.message) {
            errorMessage = error.message;
          }
          
          this.toastService.error('Lỗi', errorMessage);
        }
      });
    } else {
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
      
      this.toastService.warning('Cảnh báo', 'Vui lòng kiểm tra lại thông tin đã nhập!');
    }
  }

  onCancel(): void {
    if (this.productForm.dirty || this.selectedCategoryIds.length > 0) {
      this.toastService.showConfirmation(
        'Xác nhận hủy',
        'Bạn có chắc chắn muốn hủy thêm sản phẩm? Dữ liệu đã nhập sẽ không được lưu.',
        () => this.router.navigate(['/product/list-product']),
        () => this.toastService.info('Đã hủy', 'Tiếp tục thêm sản phẩm')
      );
    } else {
      this.router.navigate(['/product/list-product']);
    }
  }

  // ✅ Helper method để lấy tên category theo ID
  getCategoryNameById(categoryId: string): string {
    const category = this.categories.find(c => c.id.toString() === categoryId);
    return category ? category.name : categoryId;
  }

  // ✅ Helper method để lấy class CSS cho badge type
  getCategoryTypeBadgeClass(type?: string): string {
    switch (type) {
      case 'BLOG': return 'bg-info';
      case 'PRODUCT': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  // ✅ Helper method để lấy text cho type
  getCategoryTypeText(type?: string): string {
    switch (type) {
      case 'BLOG': return 'Blog';
      case 'PRODUCT': return 'Sản phẩm';
      default: return 'Khác';
    }
  }
}