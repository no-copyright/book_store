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
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isEditMode = false;

  // Thêm properties cho file handling
  selectedThumbnailFile?: File;
  selectedImageFiles: File[] = [];

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
    
    // Đảm bảo tất cả FormControl được khởi tạo đầy đủ
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
      active: ['true'], // Sử dụng string thay vì boolean
      imageUrls: [[]],
      categories: [[]],
      createdAt: [''],
      
      // Thêm các computed fields để tránh lỗi
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
    this.loadCategories(); // ✅ Load categories trước
  }

  // ✅ Load categories và sau đó load product data
  loadCategories(): void {
    this.categoryService.getCategoriesFlat().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Categories loaded:', this.categories.length);
        
        // ✅ Load product data sau khi đã có categories
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
          console.log('Product categories:', product.categories);
          
          // Set image preview from current thumbnail
          this.imagePreview = product.thumbnail;
          
          // ✅ Set selected categories từ product data TRƯỚC KHI patch form
          if (product.categories && Array.isArray(product.categories)) {
            this.selectedCategoryIds = product.categories.map(id => id.toString());
            console.log('Selected category IDs set:', this.selectedCategoryIds);
          } else {
            this.selectedCategoryIds = [];
            console.log('No categories in product, setting empty array');
          }
          
          // Patch dữ liệu với active conversion
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
            active: product.active === true ? 'true' : 'false', // Convert boolean to string cho select
            imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls : [],
            categories: this.selectedCategoryIds, // ✅ Sử dụng selectedCategoryIds đã set
            createdAt: product.createdAt || new Date().toISOString()
          });
          
          console.log('Form patched with categories:', this.productForm.get('categories')?.value);
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
    
    console.log('Category toggled:', id);
    console.log('Selected category IDs after toggle:', this.selectedCategoryIds);
  }

  // ✅ Check if category is selected
  isCategorySelected(categoryId: string | number): boolean {
    const isSelected = this.selectedCategoryIds.includes(categoryId.toString());
    console.log(`Category ${categoryId} selected:`, isSelected);
    return isSelected;
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
    console.log('Category modal opened. Categories available:', this.categories.length);
    console.log('Selected categories:', this.selectedCategoryIds);
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
    console.log('All categories cleared');
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

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.productForm.patchValue({ thumbnail: '' });
  }

  // Method để handle thumbnail file selection
  onThumbnailFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedThumbnailFile = file;
      console.log('Thumbnail file selected:', file.name);
    }
  }

  // Method để handle multiple image files selection
  onImageFilesSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.selectedImageFiles = files;
    console.log('Image files selected:', files.map(f => f.name));
  }

  onSubmit(): void {
    // Kiểm tra form tồn tại và valid
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
      
      // Convert active từ string về boolean
      let activeValue: boolean;
      if (typeof formValue.active === 'string') {
        activeValue = formValue.active === 'true';
      } else {
        activeValue = Boolean(formValue.active);
      }
      
      // ✅ Convert selectedCategoryIds to numbers for API
      const categoryIds = this.selectedCategoryIds.map(id => parseInt(id, 10));
      
      // Chuẩn bị dữ liệu product
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
        active: activeValue, // Sử dụng giá trị đã convert
        imageUrls: Array.isArray(formValue.imageUrls) ? formValue.imageUrls : [],
        categories: categoryIds, // ✅ Sử dụng categoryIds đã convert thành number[]
        createdAt: formValue.createdAt || new Date().toISOString()
      };

      console.log('=== EDIT PRODUCT DEBUG ===');
      console.log('Categories to send:', categoryIds);
      console.log('Product data to send:', JSON.stringify(productData, null, 2));

      // Gọi API với multipart data
      this.productService.updateProduct(
        productData, 
        this.selectedThumbnailFile, 
        this.selectedImageFiles
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

  // Thêm method để debug form validation errors
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