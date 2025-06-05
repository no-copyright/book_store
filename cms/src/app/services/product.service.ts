import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';

// ... (Product and ProductListResponse interfaces remain the same) ...
export interface Product {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  packageSize: number;
  pageSize: number;
  form: string;
  thumbnail: string;
  quantity: number;
  discount: number;
  price: number;
  priority: number;
  description: string;
  averageRate: number;
  active: boolean;
  imageUrls: string[];
  categories: number[];
  createdAt: string;

  // Computed properties cho compatibility với UI hiện tại
  code?: string;
  name?: string;
  image?: string;
  originalPrice?: number;
  status?: string;
  format?: string;
}

export interface ProductListResponse {
  status: number;
  message: string;
  result: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    data: Product[];
  };
  timestamp: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  priority: number | null;
  parentId: number | null;
  slug: string;
}

export interface ProductCategoryResponse {
  status: number;
  message: string;
  result: ProductCategory[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  // Lấy danh sách sản phẩm với phân trang
  getProducts(pageIndex: number = 1, pageSize: number = 10): Observable<ProductListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ProductListResponse>(`${API_BASE_URL}/product/`, { params });
  }

  // Lấy danh sách sản phẩm đã được xử lý cho UI
  getProductsForUI(pageIndex: number = 1, pageSize: number = 10): Observable<{
    products: Product[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
  }> {
    return this.getProducts(pageIndex, pageSize).pipe(
      map(response => {
        // Transform data để tương thích với UI hiện tại
        const transformedProducts = response.result.data.map(product => ({
          ...product,
          // Mapping cho compatibility với UI hiện tại
          code: `SP${product.id.toString().padStart(3, '0')}`,
          name: product.title,
          image: product.thumbnail,
          originalPrice: product.price,
          format: product.form,
          status: this.getProductStatus(product.quantity, product.active)
        }));

        return {
          products: transformedProducts,
          totalElements: response.result.totalElements,
          totalPages: response.result.totalPages,
          currentPage: response.result.currentPage
        };
      })
    );
  }

  // Xác định trạng thái sản phẩm
  private getProductStatus(quantity: number, active: boolean): string {
    if (!active) return 'out_of_stock';
    if (quantity === 0) return 'out_of_stock';
    if (quantity <= 10) return 'low_stock';
    return 'in_stock';
  }

  // Lấy sản phẩm theo ID
  getProductById(id: string): Observable<Product | null> {
    return this.http.get<{
      status: number;
      message: string;
      result: Product;
      timestamp: string;
    }>(`${API_BASE_URL}/product/${id}`).pipe(
      map(response => {
        if (response.status === 200 && response.result) {
          const product = response.result;
          return {
            ...product,
            code: `SP${product.id.toString().padStart(3, '0')}`,
            name: product.title,
            image: product.thumbnail,
            originalPrice: product.price,
            format: product.form,
            status: this.getProductStatus(product.quantity, product.active)
          };
        }
        return null;
      })
    );
  }

  // Tìm kiếm sản phẩm
searchProducts(keyword: string, pageIndex: number = 1, pageSize: number = 10): Observable<{
  products: Product[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}> {
  const params = new HttpParams()
    .set('pageIndex', pageIndex.toString())
    .set('pageSize', pageSize.toString())
    .set('title', keyword); // Thay đổi từ 'keyword' thành 'title'

  // Sử dụng endpoint chính với filter thay vì /search
  return this.http.get<ProductListResponse>(`${API_BASE_URL}/product/`, { params }).pipe(
    map(response => {
      const transformedProducts = response.result.data.map(product => ({
        ...product,
        code: `SP${product.id.toString().padStart(3, '0')}`,
        name: product.title,
        image: product.thumbnail,
        originalPrice: product.price,
        format: product.form,
        status: this.getProductStatus(product.quantity, product.active)
      }));

      return {
        products: transformedProducts,
        totalElements: response.result.totalElements,
        totalPages: response.result.totalPages,
        currentPage: response.result.currentPage
      };
    })
  );
}

  // Các method khác
  // Cập nhật method addProduct
addProduct(product: Product, thumbnailFile?: File, imageFiles?: File[]): Observable<Product> {
  // Loại bỏ các computed fields và ID (server sẽ tự sinh ID)
  const { id, code, name, image, originalPrice, status, format, ...rawProduct } = product;
  
  // Chuẩn bị data theo format API yêu cầu
  const productData = {
    title: rawProduct.title || '',
    author: rawProduct.author || '',
    publisher: rawProduct.publisher || '',
    publicationYear: rawProduct.publicationYear || new Date().getFullYear(),
    packageSize: rawProduct.packageSize || 0,
    pageSize: rawProduct.pageSize || 0,
    form: rawProduct.form || '',
    thumbnail: rawProduct.thumbnail || '',
    quantity: rawProduct.quantity || 0,
    discount: rawProduct.discount || 0,
    price: rawProduct.price || 0,
    priority: rawProduct.priority || 0,
    description: rawProduct.description || '',
    categoryIds: Array.isArray(rawProduct.categories) ? rawProduct.categories : [],
    active: rawProduct.active === true
  };
  
  console.log('=== ADD PRODUCT DEBUG ===');
  console.log('Product data:', JSON.stringify(productData, null, 2));
  console.log('CategoryIds type and value:', typeof productData.categoryIds, productData.categoryIds);
  console.log('Thumbnail file:', thumbnailFile?.name, thumbnailFile?.size);
  console.log('Image files count:', imageFiles?.length || 0);
  
  // Tạo FormData cho multipart request
  const formData = new FormData();
  
  // Append product data như JSON RequestPart
  formData.append('product', new Blob([JSON.stringify(productData)], {
    type: 'application/json'
  }));
  
  // Append thumbnail file nếu có
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile);
    console.log('Thumbnail file added:', thumbnailFile.name, thumbnailFile.size);
  }
  
  // Append image files nếu có
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file, index) => {
      formData.append('images', file);
      console.log(`Image file ${index + 1} added:`, file.name, file.size);
    });
  }
  
  console.log('FormData prepared for ADD product multipart request');
  
  // Gửi request không set Content-Type header (để browser tự động set multipart/form-data)
  return this.http.post<{
    status: number;
    message: string;
    result: Product;
    timestamp: string;
  }>(`${API_BASE_URL}/product/`, formData).pipe(
    map(response => {
      console.log('Add product response:', response);
      if (response.status === 200 || response.status === 201) {
        return response.result;
      }
      throw new Error(response.message || 'Thêm sản phẩm thất bại');
    })
  );
}

// Cập nhật method updateProduct để gửi multipart/form-data
updateProduct(product: Product, thumbnailFile?: File, imageFiles?: File[]): Observable<Product> {
  // Loại bỏ các computed fields
  const { code, name, image, originalPrice, status, format, ...rawProduct } = product;
  
  // Chuẩn bị data theo format API yêu cầu
  const productData = {
    title: rawProduct.title || '',
    author: rawProduct.author || '',
    publisher: rawProduct.publisher || '',
    publicationYear: rawProduct.publicationYear || new Date().getFullYear(),
    packageSize: rawProduct.packageSize || 0,
    pageSize: rawProduct.pageSize || 0,
    form: rawProduct.form || '',
    thumbnail: rawProduct.thumbnail || '',
    quantity: rawProduct.quantity || 0,
    discount: rawProduct.discount || 0,
    price: rawProduct.price || 0,
    priority: rawProduct.priority || 0,
    description: rawProduct.description || '',
    categoryIds: Array.isArray(rawProduct.categories) ? rawProduct.categories : [],
    active: rawProduct.active === true,
    // ✅ THÊM current imageUrls để server biết ảnh nào cần giữ lại
    currentImageUrls: Array.isArray(rawProduct.imageUrls) ? rawProduct.imageUrls : []
  };
  
  console.log('=== UPDATE PRODUCT DEBUG ===');
  console.log('Product data for update:', JSON.stringify(productData, null, 2));
  console.log('CategoryIds type and value:', typeof productData.categoryIds, productData.categoryIds);
  console.log('Current image URLs:', productData.currentImageUrls);
  console.log('New thumbnail file:', thumbnailFile?.name, thumbnailFile?.size);
  console.log('New image files count:', imageFiles?.length || 0);
  
  // Tạo FormData cho multipart request
  const formData = new FormData();
  
  // Append product data như JSON RequestPart
  formData.append('product', new Blob([JSON.stringify(productData)], {
    type: 'application/json'
  }));
  
  // Append thumbnail file nếu có
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile);
    console.log('New thumbnail file added:', thumbnailFile.name, thumbnailFile.size);
  }
  
  // Append image files nếu có
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file, index) => {
      formData.append('images', file);
      console.log(`New image file ${index + 1} added:`, file.name, file.size);
    });
  }
  
  console.log('FormData prepared for UPDATE product multipart request');
  
  // Gửi request không set Content-Type header
  return this.http.put<{
    status: number;
    message: string;
    result: Product;
    timestamp: string;
  }>(`${API_BASE_URL}/product/${product.id}`, formData).pipe(
    map(response => {
      console.log('Update product response:', response);
      if (response.status === 200) {
        return response.result;
      }
      throw new Error(response.message || 'Cập nhật sản phẩm thất bại');
    })
  );
}

  deleteProduct(id: string): Observable<boolean> {
    return this.http.delete<{
      status: number;
      message: string;
      timestamp: string;
    }>(`${API_BASE_URL}/product/${id}`).pipe(
      map(response => response.status === 200)
    );
  }

// Thêm method này vào ProductService
toggleProductActive(id: string, currentActiveState: boolean): Observable<boolean> {
  const newActiveState = !currentActiveState;

  // Endpoint này có thể vẫn chấp nhận JSON cho một boolean đơn giản.
  // Nếu nó cũng yêu cầu FormData, bạn cần thay đổi tương tự.
  // Tuy nhiên, gửi một boolean trong body PUT thường dùng application/json.
  console.log('Toggle request:', {
    productId: id,
    currentState: currentActiveState,
    newState: newActiveState,
    typeof_newState: typeof newActiveState
  });

  return this.http.put<{
    status: number;
    message: string;
    result?: any;
    timestamp: string;
  }>(`${API_BASE_URL}/product/active/${id}`, newActiveState, { // Server có thể mong đợi chỉ boolean, không phải object
    headers: {
      'Content-Type': 'application/json' // Hoặc text/plain tùy server
    }
  }).pipe(
    map(response => {
      console.log('Toggle response:', response);
      if (response.status === 200) {
        return true;
      }
      throw new Error(response.message || 'Không thể thay đổi trạng thái sản phẩm');
    })
  );
}
getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategoryResponse>(`${API_BASE_URL}/product/category`).pipe(
      map(response => {
        if (response.status === 200) {
          return response.result;
        }
        return [];
      })
    );
  }
}