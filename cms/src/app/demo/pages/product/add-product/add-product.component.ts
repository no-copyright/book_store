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
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  categories: Category[] = [];
  selectedCategoryIds: string[] = [];
  showCategoryModal = false; // ✅ Thêm để hiển thị modal chọn danh mục

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

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      
      this.productForm.patchValue({
        thumbnail: file.name
      });
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.productForm.patchValue({
      thumbnail: ''
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.submitting = true;
      const formValue = this.productForm.value;
      
      // Convert selectedCategoryIds to numbers for API
      const categoryIds = this.selectedCategoryIds.map(id => parseInt(id, 10));
      
      const productData: Product = {
        id: 0,
        title: formValue.title,
        author: formValue.author,
        publisher: formValue.publisher,
        publicationYear: formValue.publicationYear,
        packageSize: formValue.packageSize,
        pageSize: formValue.pageSize,
        form: formValue.form,
        thumbnail: formValue.thumbnail,
        quantity: formValue.quantity,
        discount: formValue.discount,
        price: formValue.price,
        discountPercent: formValue.discountPercent,
        priority: formValue.priority,
        description: formValue.description,
        averageRate: 0,
        active: formValue.active,
        imageUrls: formValue.imageUrls || [],
        categories: categoryIds,
        createdAt: ''
      };

      console.log('Sending product data:', productData);
      
      this.productService.addProduct(productData).subscribe({
        next: (product) => {
          this.toastService.success('Thành công', `Thêm sản phẩm "${product.title}" thành công!`);
          this.router.navigate(['/product/list-product']);
        },
        error: (error) => {
          console.error('Lỗi khi thêm sản phẩm:', error);
          this.toastService.error('Lỗi', 'Đã xảy ra lỗi khi thêm sản phẩm!');
          this.submitting = false;
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