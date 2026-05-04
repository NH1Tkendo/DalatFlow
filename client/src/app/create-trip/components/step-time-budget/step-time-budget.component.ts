import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  leafOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { TripStateService } from '../../services/create-trip-state.service';
import { TripValidationService } from '../../services/trip-validation.service';

@Component({
  selector: 'app-step-time-budget',
  templateUrl: './step-time-budget.component.html',
  styleUrls: ['./step-time-budget.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule], // Bắt buộc phải có FormsModule để chạy [(ngModel)]
})
export class StepTimeBudgetComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();

  // Dữ liệu tạm trên giao diện (chưa gộp)
  public stepData = {
    startDate: '',
    endDate: '',
    arriveTime: '',
    leaveTime: '',
    budgetTier: 2,
  };

  public displayBudgetText: string = 'Khoảng 5.000.000';

  currentStepIndex: number = 2; // Index của step hiện tại
  isLoading: boolean = false;
  validationErrors: any[] = [];
  validationWarnings: any[] = [];

  constructor(
    private tripStateService: TripStateService,
    private validationService: TripValidationService,
    private toastCtrl: ToastController,
  ) {
    addIcons({
      arrowForwardOutline,
      leafOutline,
      arrowBackOutline,
    });
  }

  ngOnInit() {
    // 1. Khởi tạo ngày mặc định là ngày hiện tại cho cả ngày bắt đầu và kết thúc
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0]; // Lấy phần YYYY-MM-DD

    this.stepData.startDate = todayISO;
    this.stepData.endDate = todayISO;
    this.stepData.arriveTime = '1970-01-01T08:00:00'; // Chỉ lấy phần giờ (08:00)
    this.stepData.leaveTime = '1970-01-01T14:00:00'; // Chỉ lấy phần giờ (14:00)

    // 2. Lấy dữ liệu nháp từ Service (nếu có) đắp lên form
    this.tripStateService.currentTripData$.subscribe((draft) => {
      if (draft && draft.startDate) {
        // Tách chuỗi ISO "YYYY-MM-DDTHH:mm:ss" ngược lại thành Ngày và Giờ cho UI
        this.stepData.startDate = draft.startDate;
        this.stepData.arriveTime = draft.startDate;

        this.stepData.endDate = draft.endDate || this.stepData.endDate;
        this.stepData.leaveTime = draft.endDate || this.stepData.leaveTime;

        this.stepData.budgetTier = draft.budgetTier || 2;
        this.updateBudgetText();
      }
    });
  }

  // 3. Cập nhật text hiển thị khi kéo thanh Ngân sách
  updateBudgetText() {
    switch (this.stepData.budgetTier) {
      case 1:
        this.displayBudgetText = 'Dưới 3.000.000'; // Tiết kiệm
        break;
      case 2:
        this.displayBudgetText = 'Khoảng 5.000.000'; // Trung bình
        break;
      case 3:
        this.displayBudgetText = 'Trên 10.000.000'; // Sang trọng
        break;
      default:
        this.displayBudgetText = 'Chưa xác định';
    }
  }

  // 4. Hàm cắt ghép Ngày và Giờ siêu việt
  private combineDateTime(dateIso: string, timeIso: string): string {
    if (!dateIso || !timeIso) return '';
    // Lấy phần "YYYY-MM-DD" từ dateIso
    const datePart = dateIso.split('T')[0];
    // Lấy phần "HH:mm:ss..." từ timeIso
    const timePart = timeIso.split('T')[1];

    // Ghép lại thành 1 chuỗi ISO hoàn chỉnh
    return `${datePart}T${timePart}`;
  }

  // 5. Nút Bấm Tiếp Tục
  async onNextClick() {
    // Validate sương sương
    if (!this.stepData.startDate || !this.stepData.endDate) {
      alert('Vui lòng chọn đầy đủ ngày đi và ngày về nhé!');
      return;
    }

    // Gộp 4 biến thành 2 mốc thời gian duy nhất chuẩn ISO
    const finalArrivalString = this.combineDateTime(
      this.stepData.startDate,
      this.stepData.arriveTime,
    );
    const finalDepartureString = this.combineDateTime(
      this.stepData.endDate,
      this.stepData.leaveTime,
    );

    // Lưu vào Service (Nó sẽ tự động ghi xuống IndexedDB)
    await this.tripStateService.updateTripData({
      startDate: finalArrivalString,
      endDate: finalDepartureString,
      budgetTier: this.stepData.budgetTier,
    });

    // Báo cho "Nhạc trưởng" (create-trip.page.ts) chuyển sang Bước 2
    this.nextStep.emit();
  }
}
