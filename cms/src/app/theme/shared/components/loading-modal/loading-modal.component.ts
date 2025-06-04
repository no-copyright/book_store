import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="show">
      <div class="loading-modal">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <div class="loading-text">{{ message }}</div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    }

    .loading-modal {
      background: white;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      min-width: 200px;
    }

    .loading-spinner {
      margin-bottom: 15px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    .loading-text {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingModalComponent {
  @Input() show: boolean = false;
  @Input() message: string = 'Đang xử lý...';
}