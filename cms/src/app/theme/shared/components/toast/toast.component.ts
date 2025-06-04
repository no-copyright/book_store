import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts; trackBy: trackByToast" 
           class="toast-item toast-{{ toast.type }}"
           [class.toast-enter]="true">
        <div class="toast-header">
          <i class="toast-icon feather" [ngClass]="getIcon(toast.type)"></i>
          <strong class="toast-title">{{ toast.title }}</strong>
          <button type="button" class="toast-close" (click)="remove(toast.id)" *ngIf="toast.type !== 'confirmation'">
            <i class="feather icon-x"></i>
          </button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
        
        <!-- Confirmation buttons -->
        <div class="toast-actions" *ngIf="toast.type === 'confirmation'">
          <button type="button" 
                  class="btn btn-sm btn-danger me-2" 
                  (click)="confirm(toast.id)"
                  [attr.data-toast-id]="toast.id">
            <i class="feather icon-check me-1"></i> Xác nhận
          </button>
          <button type="button" 
                  class="btn btn-sm btn-secondary" 
                  (click)="cancel(toast.id)"
                  [attr.data-toast-id]="toast.id">
            <i class="feather icon-x me-1"></i> Hủy
          </button>
        </div>
        
        <div class="toast-progress" 
             [style.animation-duration.ms]="toast.duration"
             *ngIf="toast.duration && toast.duration > 0 && toast.type !== 'confirmation'"></div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      pointer-events: none;
    }

    .toast-item {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-bottom: 12px;
      overflow: hidden;
      position: relative;
      border-left: 4px solid;
      animation: slideInRight 0.3s ease-out;
      pointer-events: all;
    }

    .toast-success { border-left-color: #28a745; }
    .toast-error { border-left-color: #dc3545; }
    .toast-warning { border-left-color: #ffc107; }
    .toast-info { border-left-color: #17a2b8; }
    .toast-confirmation { border-left-color: #6f42c1; }

    .toast-header {
      display: flex;
      align-items: center;
      padding: 12px 16px 8px 16px;
      border-bottom: 1px solid #f1f1f1;
    }

    .toast-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    .toast-success .toast-icon { color: #28a745; }
    .toast-error .toast-icon { color: #dc3545; }
    .toast-warning .toast-icon { color: #ffc107; }
    .toast-info .toast-icon { color: #17a2b8; }
    .toast-confirmation .toast-icon { color: #6f42c1; }

    .toast-title {
      flex: 1;
      font-size: 14px;
      font-weight: 600;
      margin: 0;
    }

    .toast-close {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: #666;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .toast-close:hover {
      color: #333;
      background-color: #f8f9fa;
    }

    .toast-body {
      padding: 8px 16px 12px 16px;
      color: #666;
      font-size: 14px;
      line-height: 1.4;
    }

    .toast-actions {
      padding: 8px 16px 12px 16px;
      display: flex;
      gap: 8px;
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1));
      animation: progress linear;
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .btn {
      padding: 4px 12px;
      border: 1px solid;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      text-decoration: none;
    }

    .btn-danger {
      background-color: #dc3545;
      border-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
      border-color: #bd2130;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      border-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
      border-color: #545b62;
      color: white;
    }

    .btn i {
      pointer-events: none;
    }

    .me-1 {
      margin-right: 0.25rem;
    }

    .me-2 {
      margin-right: 0.5rem;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toasts.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  remove(id: string) {
    this.toastService.remove(id);
  }

  confirm(id: string) {
    this.toastService.confirm(id);
  }

  cancel(id: string) {
    this.toastService.cancel(id);
  }

  trackByToast(index: number, toast: Toast): string {
    return toast.id;
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'icon-check-circle';
      case 'error': return 'icon-x-circle';
      case 'warning': return 'icon-alert-triangle';
      case 'info': return 'icon-info';
      case 'confirmation': return 'icon-help-circle';
      default: return 'icon-info';
    }
  }
}