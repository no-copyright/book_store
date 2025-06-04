import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HomepageService, Homepage } from 'src/app/services/homepage.service';

@Component({
  selector: 'app-list-homepage',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './list-homepage.component.html',
  styleUrls: ['./list-homepage.component.scss']
})
export class ListHomepageComponent implements OnInit {
  homepageConfig: Homepage | null = null;
  loading = false;

  constructor(
    private router: Router,
    private homepageService: HomepageService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadHomepageConfig();
  }

  loadHomepageConfig(): void {
    this.homepageService.getHomepageConfig().subscribe({
      next: (config) => {
        this.homepageConfig = config;
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải cấu hình trang chủ:', err);
        this.loading = false;
      }
    });
  }

  navigateToEdit(): void {
    this.router.navigate(['/homepage/edit']);
  }

  getFormattedDate(date: Date | undefined): string {
    if (!date) return 'Không có dữ liệu';
    return new Date(date).toLocaleString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}