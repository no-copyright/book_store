import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Homepage {
  id: number;
  banner_1: string;
  banner_2: string;
  banner_3: string;
  last_updated?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HomepageService {
  // Thông thường chỉ có một bản ghi cấu hình trang chủ
  private mockHomepage: Homepage = {
    id: 1,
    banner_1: 'assets/images/banner/banner-1.jpg',
    banner_2: 'assets/images/banner/banner-2.jpg',
    banner_3: 'assets/images/banner/banner-3.jpg',
    last_updated: new Date('2023-08-15')
  };

  constructor() { }

  // Lấy cấu hình trang chủ
  getHomepageConfig(): Observable<Homepage> {
    return of(this.mockHomepage);
  }

  // Cập nhật cấu hình trang chủ
  updateHomepageConfig(config: Homepage): Observable<Homepage> {
    this.mockHomepage = {
      ...config,
      id: 1, // Đảm bảo id không bị thay đổi
      last_updated: new Date()
    };
    
    return of(this.mockHomepage);
  }

  // Lưu ảnh banner (giả lập)
  uploadBannerImage(file: File, bannerPosition: number): Observable<string> {
    // Giả lập đường dẫn ảnh sau khi upload
    const mockImageUrl = `assets/images/banner/banner-${bannerPosition}.jpg`;
    return of(mockImageUrl);
  }
}