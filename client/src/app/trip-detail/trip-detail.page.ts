import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripData } from './models/trip-detail.model';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ExploreService } from '../shared/services/explore.service';
import { addIcons } from 'ionicons';
import { mapOutline } from 'ionicons/icons';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.page.html',
  styleUrls: ['./trip-detail.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonButton,
    IonSpinner,
  ],
})
export class TripDetailPage implements OnInit {
  // Giả lập dữ liệu AI trả về (Bạn sẽ thay bằng dữ liệu thật)
  tripData?: TripData;

  selectedDayIndex: number = 0; // Mặc định hiển thị ngày đầu tiên
  isLoading = false;
  tripParams: any = {};
  isNavigatedWithState = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private exploreService: ExploreService,
  ) {
    addIcons({ mapOutline });
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      if (navigation.extras.state['tripResult']) {
        this.tripData = navigation.extras.state['tripResult'];
        console.log(
          'Trang Detail đã hứng được data qua Route State:',
          this.tripData,
        );
        this.isNavigatedWithState = true;
      }
    }

    // Nếu chưa có data từ route state (như vừa navigate đến không truyền kèm state), lấy qua ID
    if (!this.tripData) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.loadTripDetail(id);
      }
    }
  }

  loadTripDetail(id: string) {
    this.isLoading = true;
    this.exploreService.getItineraryById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Data structure based on API response: { success: true, data: {...} }
        if (res.success && res.data) {
          this.tripData = res.data;
          console.log('Trang Detail đã hứng được data qua API:', this.tripData);
        } else {
          // Fallback to res as data if format changes
          this.tripData = res;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Lỗi khi lấy chi tiết lịch trình', err);
      },
    });
  }

  // Đổi ngày khi bấm trên Segment
  segmentChanged(event: any) {
    this.selectedDayIndex = parseInt(event.detail.value, 10);
  }

  // Tuyệt chiêu: Map activityType ra Icon và Màu sắc
  getIconConfig(type: string) {
    switch (type) {
      case 'meal':
        return { name: 'restaurant', color: '#F2994A', bg: '#FDF3E9' };
      case 'hotel':
        return { name: 'bed', color: '#9B51E0', bg: '#F4EBFB' };
      case 'transport':
        return { name: 'car', color: '#2D9CDB', bg: '#EAF5FC' };
      case 'attraction':
      default:
        return { name: 'camera', color: '#27AE60', bg: '#EAF7EF' };
    }
  }

  // Nút xem bản đồ
  viewOnMap(placeId: string) {
    console.log('Mở bản đồ cho địa điểm:', placeId);
    // TODO: Chuyển hướng về Home, truyền placeId để vẽ đường đi
  }
}
