import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { close, calendarOutline, cashOutline } from 'ionicons/icons';

import { StepTimeBudgetComponent } from './components/step-time-budget/step-time-budget.component';
import { StepDetailsComponent } from './components/step-details/step-details.component';
import { StepInterestsComponent } from './components/step-interests/step-interests.component';
import { TripStateService } from './services/create-trip-state.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.page.html',
  styleUrls: ['./create-trip.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonIcon,
    IonToolbar,
    IonTitle,
    IonButton,
    IonButtons,
    CommonModule,
    FormsModule,
    StepTimeBudgetComponent,
    StepInterestsComponent,
    StepDetailsComponent,
  ],
})
export class CreateTripPage implements OnInit {
  public step: number = 1;
  public totalSteps: number = 3;
  public currentStep: number = 1;

  constructor(
    private tripStateService: TripStateService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private auth: Auth,
  ) {
    // Đăng ký icon
    addIcons({ close, calendarOutline, cashOutline });
  }

  ngOnInit() {
    // Có thể check xem có bản nháp nào đang ở Bước 2, Bước 3 không để nhảy thẳng đến đó (Tùy chọn)
  }

  // Hàm chuyển bước do các Component con gọi lên qua Event Emitter
  goToStep(step: number) {
    if (step >= 1 && step <= 3) {
      this.currentStep = step;
    }
  }

  goBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.navCtrl.back();
    }
  }

  getStepTitle(): string {
    switch (this.currentStep) {
      case 1:
        return 'Thời gian & Ngân sách';
      case 2:
        return 'Sở thích & Điểm nhấn';
      case 3:
        return 'Chi tiết & Yêu cầu';
      default:
        return '';
    }
  }

  // Hàm xử lý khi hoàn tất nhập form
  async finish() {
    try {
      // Dùng firstValueFrom để lấy data 1 lần duy nhất từ Observable
      const finalTripData = await firstValueFrom(
        this.tripStateService.currentTripData$,
      );

      console.log('Dữ liệu sẵn sàng gửi lên API:', finalTripData);

      // Gọi generateTrip
      this.generateTrip(finalTripData);
    } catch (error) {
      console.error('Lỗi khi chuẩn bị sinh lịch trình:', error);
      const toast = await this.toastCtrl.create({
        message: 'Có lỗi xảy ra khi lấy dữ liệu, vui lòng thử lại sau!',
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
      await toast.present();
    }
  }

  async confirmTrip() {
    // 1. Lấy dữ liệu final từ Tủ sắt
    let finalTripData = {};
    this.tripStateService.currentTripData$.subscribe((data) => {
      finalTripData = data;
    });

    console.log('Dữ liệu gửi lên server:', finalTripData);

    this.generateTrip(finalTripData);
  }

  async generateTrip(finalTripData: any) {
    if (!this.auth.currentUser) {
      console.warn('User is not logged in!');
      return;
    }

    // Đánh dấu đang gen
    this.tripStateService.setGenerating(true);

    try {
      // Điều hướng về màn hình chính ngay lập tức để chờ kết quả thay vì giữ nguyên trang CreateTrip
      this.navCtrl.navigateRoot('/tabs/home');

      // Cho dọn dẹp bản nháp hiển thị ngay lập tức (không bắt buộc nhưng tốt cho UI tiếp theo)
      await this.tripStateService.clearDraft();

      // 3. GỌI API LÊN BACK-END
      const user = this.auth.currentUser;
      const token = await user.getIdToken();

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      const apiUrl = `${environment.apiUrl}/api/itineraries/generate`;
      const response = await firstValueFrom(
        this.http.post<any>(apiUrl, finalTripData, { headers }),
      );

      console.log('Kết quả từ API:', response);
      // ---------------------------------------------------------

      // 4. Báo thành công và dọn dẹp bản nháp
      await this.tripStateService.clearDraft(); // Trả Tủ sắt về số 0

      const toast = await this.toastCtrl.create({
        message: 'Tạo chuyến đi thành công!',
        duration: 2000,
        color: 'success',
        position: 'top',
      });
      await toast.present();

      // 5. Chuyển hướng sang trang hiển thị kết quả
      if (response?.data) {
        this.navCtrl.navigateForward(`/trip-detail/${response.data.id}`, {
          state: {
            tripResult: response.data,
          },
        });
      }
    } catch (error) {
      console.error('Lỗi khi sinh lịch trình:', error);
      const toast = await this.toastCtrl.create({
        message: 'Có lỗi xảy ra, vui lòng thử lại sau!',
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
      await toast.present();
    } finally {
      // Đã tạo xong (thành công hoặc có lỗi)
      this.tripStateService.setGenerating(false);
    }
  }
}
