import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../constants/api.constants';

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  priority: number;
  parent_id?: string | number | null;
  parentId?: number | null;
  type?: string;
  level?: number;
  children?: Category[];
}

export interface CategoryListResponse {
  status: number;
  message: string;
  result: Category[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesCache: Category[] | null = null; // ✅ Thêm cache để tránh call API nhiều lần

  constructor(private http: HttpClient) {}

  // Call API thực để lấy danh sách category
  getCategories(): Observable<Category[]> {
    // ✅ Sử dụng cache nếu đã có data
    if (this.categoriesCache) {
      return of(this.categoriesCache);
    }

    return this.http.get<CategoryListResponse>(`${API_BASE_URL}/category/`).pipe(
      map(response => {
        // ✅ Transform data để tương thích với UI hiện tại
        const transformedCategories = this.transformCategories(response.result);
        
        // ✅ Cache data để tránh call API nhiều lần
        this.categoriesCache = transformedCategories;
        
        return transformedCategories;
      }),
      catchError(error => {
        console.error('Error fetching categories:', error);
        // Fallback với mock data nếu API lỗi
        this.categoriesCache = this.mockCategories;
        return of(this.mockCategories);
      })
    );
  }

  // ✅ Transform categories từ API response
  private transformCategories(apiCategories: any[]): Category[] {
    const transformCategory = (category: any, level: number = 0): Category => {
      const transformed: Category = {
        id: category.id.toString(),
        name: category.name,
        slug: category.slug,
        priority: category.priority,
        parent_id: category.parentId?.toString() || null,
        parentId: category.parentId,
        type: category.type,
        level: level,
        children: []
      };

      // ✅ Xử lý children nếu có
      if (category.children && Array.isArray(category.children)) {
        transformed.children = category.children.map((child: any) => 
          transformCategory(child, level + 1)
        );
      }

      return transformed;
    };

    return apiCategories.map(category => transformCategory(category));
  }

  // ✅ Flatten categories để hiển thị dạng phẳng
  private flattenCategories(categories: Category[]): Category[] {
    const flattened: Category[] = [];
    
    const addCategory = (category: Category) => {
      flattened.push(category);
      if (category.children && category.children.length > 0) {
        category.children.forEach(child => addCategory(child));
      }
    };

    categories.forEach(category => addCategory(category));
    return flattened.sort((a, b) => {
      if ((a.level || 0) !== (b.level || 0)) {
        return (a.level || 0) - (b.level || 0);
      }
      return a.priority - b.priority;
    });
  }

  // ✅ Lấy categories dạng phẳng
  getCategoriesFlat(): Observable<Category[]> {
    return this.getCategories().pipe(
      map(categories => this.flattenCategories(categories))
    );
  }

  // ✅ Lấy categories dạng hierarchy (đã có children từ API)
  getCategoriesHierarchy(): Observable<Category[]> {
    return this.getCategories().pipe(
      map(categories => {
        // API đã trả về structure hierarchy, chỉ cần filter root categories
        return categories.filter(c => !c.parent_id && !c.parentId)
          .sort((a, b) => a.priority - b.priority);
      })
    );
  }

  // ✅ Xóa cache khi có thay đổi data
  clearCache(): void {
    this.categoriesCache = null;
  }

  // Lấy category theo ID
  getCategoryById(id: string): Observable<Category | null> {
    return this.getCategories().pipe(
      map(categories => {
        // Tìm trong flat categories
        const flatCategories = this.flattenCategories(categories);
        return flatCategories.find(c => c.id.toString() === id) || null;
      })
    );
  }

  // Tạo category mới
  createCategory(category: Omit<Category, 'id' | 'level' | 'children'>): Observable<Category> {
    const createCategoryData = {
      name: category.name,
      slug: category.slug,
      priority: category.priority,
      type: category.type || 'BLOG',
      parentId: category.parent_id ? parseInt(category.parent_id.toString()) : null
    };

    return this.http.post<{
      status: number;
      message: string;
      result: Category;
      timestamp: string;
    }>(`${API_BASE_URL}/category/`, createCategoryData).pipe(
      map(response => {
        if (response.status === 200 || response.status === 201) {
          // ✅ Clear cache để refresh data
          this.clearCache();
          
          return {
            ...response.result,
            id: response.result.id.toString(),
            parent_id: response.result.parentId?.toString() || null
          };
        }
        throw new Error(response.message || 'Failed to create category');
      }),
      catchError(error => {
        console.error('Error creating category:', error);
        throw error;
      })
    );
  }

  // Cập nhật category
  updateCategory(category: Category): Observable<boolean> {
    const updateCategoryData = {
      name: category.name,
      slug: category.slug,
      priority: category.priority,
      type: category.type || 'BLOG',
      parentId: category.parent_id ? parseInt(category.parent_id.toString()) : null
    };

    return this.http.put<{
      status: number;
      message: string;
      result?: any;
      timestamp: string;
    }>(`${API_BASE_URL}/category/${category.id}`, updateCategoryData).pipe(
      map(response => {
        if (response.status === 200) {
          // ✅ Clear cache để refresh data
          this.clearCache();
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error updating category:', error);
        throw error;
      })
    );
  }

  // Xóa category
  deleteCategory(id: string): Observable<boolean> {
    return this.http.delete<{
      status: number;
      message: string;
      timestamp: string;
    }>(`${API_BASE_URL}/category/${id}`).pipe(
      map(response => {
        if (response.status === 200) {
          // ✅ Clear cache để refresh data
          this.clearCache();
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error deleting category:', error);
        throw error;
      })
    );
  }

  // Lấy danh sách tất cả các danh mục để hiển thị trong dropdown
  getParentCategoryOptions(): Observable<Category[]> {
    return this.getCategoriesFlat().pipe(
      map(categories => categories.sort((a, b) => a.priority - b.priority))
    );
  }

  // Kiểm tra xem danh mục có thể là parent của một danh mục khác không
  canBeParent(categoryId: string, potentialParentId: string): boolean {
    if (categoryId === potentialParentId) return false;
    return true;
  }

  // Tạo slug từ tên
  generateSlug(name: string): string {
    let slug = name.toLowerCase()
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
      
    return slug;
  }

  // Kiểm tra xem slug đã tồn tại chưa
  isSlugExist(slug: string, excludeCategoryId?: string): boolean {
    // Với cache, tạm thời return false, trong thực tế nên có API riêng
    return false;
  }

  // Mock data để fallback khi API không khả dụng
  private mockCategories: Category[] = [
    {
      id: '1',
      name: 'Sách văn học',
      slug: 'sach-van-hoc',
      priority: 1,
      type: 'BLOG',
      level: 0,
      children: []
    },
    {
      id: '2', 
      name: 'Sách nước ngoài',
      slug: 'sach-nuoc-ngoai',
      priority: 2,
      type: 'PRODUCT',
      level: 0,
      children: []
    }
  ];
}