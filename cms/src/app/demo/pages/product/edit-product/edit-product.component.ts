import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductService, Product } from 'src/app/services/product.service';
import { ToastService } from 'src/app/services/toast.service';
import { LoadingModalComponent } from 'src/app/theme/shared/components/loading-modal/loading-modal.component';
import { CategoryService, Category } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule, LoadingModalComponent],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  productId: string;
  loading = false;
  submitting = false;
  
  // ✅ Image management - chỉ giữ lại properties cần thiết
  selectedThumbnailFile: File | null = null;
  thumbnailPreview: string | null = null;
  currentThumbnail: string | null = null;
  
  // ✅ Multiple images
  selectedImageFiles: File[] = [];
  imagePreviews: string[] = [];
  currentImages: string[] = [];
  maxImages = 5;
  
  categories: Category[] = [];
  selectedCategoryIds: string[] = [];
  showCategoryModal = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastService: ToastService,
    private categoryService: CategoryService
  ) {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    
    this.productForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.minLength(2)]],
      author: [''],
      publisher: ['', Validators.required],
      publicationYear: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      packageSize: [0, [Validators.min(0)]],
      pageSize: [0, [Validators.min(0)]],
      form: ['', Validators.required],
      thumbnail: [''],
      quantity: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPercent: [0, [Validators.min(0), Validators.max(100)]],
      priority: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      averageRate: [0],
      active: ['true'],
      imageUrls: [[]],
      categories: [[]],
      createdAt: [''],
      
      // Computed fields
      code: [''],
      name: [''],
      image: [''],
      originalPrice: [0],
      status: ['in_stock'],
      format: ['']
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategoriesFlat().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Categories loaded:', this.categories.length);
        this.loadProductData();
      },
      error: (error) => {
        console.error('Lỗi khi tải danh mục:', error);
        this.toastService.error('Lỗi', 'Không thể tải danh sách danh mục!');
        this.loading = false;
      }
    });
  }

  loadProductData(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        if (product) {
          console.log('=== LOADED PRODUCT DEBUG ===');
          console.log('Product from API:', product);
          console.log('Product imageUrls:', product.imageUrls);
          
          // Set current images từ API
          this.currentThumbnail = product.thumbnail;
          this.thumbnailPreview = product.thumbnail;
          this.currentImages = product.imageUrls || [];
          
          // Set selected categories
          if (product.categories && Array.isArray(product.categories)) {
            this.selectedCategoryIds = product.categories.map(id => id.toString());
          } else {
            this.selectedCategoryIds = [];
          }
          
          // Patch form data
          this.productForm.patchValue({
            id: product.id,
            title: product.title || '',
            author: product.author || '',
            publisher: product.publisher || '',
            publicationYear: product.publicationYear || new Date().getFullYear(),
            packageSize: product.packageSize || 0,
            pageSize: product.pageSize || 0,
            form: product.form || '',
            thumbnail: product.thumbnail || '',
            quantity: product.quantity || 0,
            discount: product.discount || 0,
            price: product.price || 0,
            discountPercent: product.discountPercent || 0,
            priority: product.priority || 0,
            description: product.description || '',
            averageRate: product.averageRate || 0,
            active: product.active.toString(),
            imageUrls: product.imageUrls || [],
            categories: product.categories || [],
            createdAt: product.createdAt || new Date().toISOString(),
            
            // Computed fields
            code: `SP${product.id.toString().padStart(3, '0')}`,
            name: product.title,
            image: product.thumbnail,
            originalPrice: product.price,
            status: this.getProductStatus(product.quantity, product.active),
            format: product.form
          });
          
          console.log('Selected category IDs:', this.selectedCategoryIds);
        } else {
          this.toastService.error('Lỗi', 'Không tìm thấy sản phẩm!');
          this.router.navigate(['/product/list-product']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải dữ liệu:', error);
        this.toastService.error('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu sản phẩm!');
        this.loading = false;
        this.router.navigate(['/product/list-product']);
      }
    });
  }

  // ✅ GIỮ LẠI CHỈ 1 METHOD onThumbnailChange
  onThumbnailChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Lỗi', 'Vui lòng chọn file hình ảnh!');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('Lỗi', 'Kích thước file không được vượt quá 5MB!');
        return;
      }

      this.selectedThumbnailFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.thumbnailPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      console.log('New thumbnail selected:', file.name);
    }
  }

  // ✅ Method để reset thumbnail về ảnh gốc
  resetThumbnail(): void {
    this.selectedThumbnailFile = null;
    this.thumbnailPreview = this.currentThumbnail;
    
    const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // ✅ Method để remove thumbnail
  removeImage(): void {
    this.selectedThumbnailFile = null;
    this.thumbnailPreview = this.currentThumbnail;
    
    const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    this.productForm.patchValue({ thumbnail: this.currentThumbnail });
  }

  // ✅ Handle multiple images
  onImagesChange(event: any): void {
    const files = Array.from(event.target.files) as File[];
    
    if (files.length === 0) return;

    const totalImages = this.currentImages.length + this.selectedImageFiles.length + files.length;
    if (totalImages > this.maxImages) {
      this.toastService.error('Lỗi', `Tổng số ảnh không được vượt quá ${this.maxImages}!`);
      return;
    }

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

    files.forEach(file => {
      this.selectedImageFiles.push(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  }

  // ✅ Remove current image
  removeCurrentImage(index: number): void {
    if (index >= 0 && index < this.currentImages.length) {
      this.currentImages.splice(index, 1);
      console.log('Current image removed, remaining:', this.currentImages.length);
    }
  }

  // ✅ Remove new image
  removeNewImage(index: number): void {
    if (index >= 0 && index < this.selectedImageFiles.length) {
      this.selectedImageFiles.splice(index, 1);
      this.imagePreviews.splice(index, 1);
      console.log('New image removed, remaining:', this.selectedImageFiles.length);
    }
  }

  // ✅ Get total images count
  getTotalImagesCount(): number {
    return this.currentImages.length + this.selectedImageFiles.length;
  }

  // ✅ Category management methods
  toggleCategory(categoryId: string | number): void {
    const id = categoryId.toString();
    const index = this.selectedCategoryIds.indexOf(id);
    
    if (index > -1) {
      this.selectedCategoryIds.splice(index, 1);
    } else {
      this.selectedCategoryIds.push(id);
    }
    
    this.productForm.patchValue({
      categories: this.selectedCategoryIds
    });
    
    console.log('Category toggled:', id);
    console.log('Selected category IDs after toggle:', this.selectedCategoryIds);
  }

  isCategorySelected(categoryId: string | number): boolean {
    return this.selectedCategoryIds.includes(categoryId.toString());
  }

  getSelectedCategoryNames(): string {
    if (this.selectedCategoryIds.length === 0) {
      return 'Chưa chọn danh mục nào';
    }
    
    const selectedCategories = this.categories.filter(cat => 
      this.selectedCategoryIds.includes(cat.id.toString())
    );
    return selectedCategories.map(cat => cat.name).join(', ');
  }

  formatCategoryName(category: Category): string {
    const level = category.level || 0;
    return '•'.repeat(level) + (level > 0 ? ' ' : '') + category.name;
  }

  openCategoryModal(): void {
    this.showCategoryModal = true;
    console.log('Category modal opened. Categories available:', this.categories.length);
    console.log('Selected categories:', this.selectedCategoryIds);
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
  }

  clearAllCategories(): void {
    this.selectedCategoryIds = [];
    this.productForm.patchValue({
      categories: []
    });
    console.log('All categories cleared');
  }

  getCategoryNameById(categoryId: string): string {
    const category = this.categories.find(c => c.id.toString() === categoryId);
    return category ? category.name : categoryId;
  }

  getCategoryTypeBadgeClass(type?: string): string {
    switch (type) {
      case 'BLOG': return 'bg-info';
      case 'PRODUCT': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getCategoryTypeText(type?: string): string {
    switch (type) {
      case 'BLOG': return 'Blog';
      case 'PRODUCT': return 'Sản phẩm';
      default: return 'Khác';
    }
  }

  // ✅ Helper method
  private getProductStatus(quantity: number, active: boolean): string {
    if (!active) {
      return 'inactive';
    }
    if (quantity <= 0) {
      return 'out_of_stock';
    }
    if (quantity <= 10) {
      return 'low_stock';
    }
    return 'in_stock';
  }

  // ✅ Submit form
  onSubmit(): void {
    if (!this.productForm) {
      this.toastService.error('Lỗi', 'Form chưa được khởi tạo!');
      return;
    }

    if (this.productForm.valid) {
      this.submitting = true;
      const formValue = this.productForm.value;
      
      console.log('=== FORM SUBMIT DEBUG ===');
      console.log('Form value before processing:', formValue);
      console.log('Selected category IDs:', this.selectedCategoryIds);
      console.log('Current images:', this.currentImages);
      console.log('Selected thumbnail file:', this.selectedThumbnailFile?.name);
      console.log('Selected image files:', this.selectedImageFiles.length);
      
      // Convert active từ string về boolean
      let activeValue: boolean;
      if (typeof formValue.active === 'string') {
        activeValue = formValue.active === 'true';
      } else {
        activeValue = Boolean(formValue.active);
      }
      
      // Convert selectedCategoryIds to numbers for API
      const categoryIds = this.selectedCategoryIds.map(id => parseInt(id, 10));
      
      // Chuẩn bị dữ liệu product với current images
      const productData: Product = {
        id: formValue.id,
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
        averageRate: Number(formValue.averageRate) || 0,
        active: activeValue,
        imageUrls: this.currentImages, // Sử dụng current images
        categories: categoryIds,
        createdAt: formValue.createdAt || new Date().toISOString(),
        
        // Computed fields
        code: formValue.code || '',
        name: formValue.title,
        image: formValue.thumbnail,
        originalPrice: formValue.price,
        status: formValue.status || 'in_stock',
        format: formValue.form
      };

      console.log('=== EDIT PRODUCT DEBUG ===');
      console.log('Categories to send:', categoryIds);
      console.log('Product data to send:', JSON.stringify(productData, null, 2));

      this.productService.updateProduct(
        productData, 
        this.selectedThumbnailFile || undefined, 
        this.selectedImageFiles.length > 0 ? this.selectedImageFiles : undefined
      ).subscribe({
        next: (response) => {
          console.log('=== UPDATE SUCCESS ===');
          console.log('API response:', response);
          
          this.submitting = false;
          this.toastService.success('Thành công', 'Cập nhật sản phẩm thành công!');
          setTimeout(() => {
            this.router.navigate(['/product/list-product']);
          }, 1500);
        },
        error: (error) => {
          console.log('=== UPDATE ERROR ===');
          console.error('Update error:', error);
          
          this.submitting = false;
          
          let errorMessage = 'Đã xảy ra lỗi khi cập nhật sản phẩm!';
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          
          this.toastService.error('Lỗi', errorMessage);
        }
      });
    } else {
      console.log('=== FORM INVALID ===');
      console.log('Form errors:', this.getFormValidationErrors());
      
      this.markFormGroupTouched(this.productForm);
      this.toastService.warning('Cảnh báo', 'Vui lòng kiểm tra lại thông tin đã nhập!');
    }
  }

  onCancel(): void {
    this.router.navigate(['/product/list-product']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    if (!formGroup) return;
    
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private getFormValidationErrors(): any {
    const errors: any = {};
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}