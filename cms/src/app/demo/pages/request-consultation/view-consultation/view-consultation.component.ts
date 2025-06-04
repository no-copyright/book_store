import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Consultation } from 'src/app/services/consultation.service';

@Component({
  selector: 'app-view-consultation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-consultation.component.html',
  styleUrls: ['./view-consultation.component.scss']
})
export class ViewConsultationComponent {
  @Input() consultation!: Consultation;

  constructor(public activeModal: NgbActiveModal) { }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}