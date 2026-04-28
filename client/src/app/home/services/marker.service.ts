import { inject, Injectable } from '@angular/core';
import { lastValueFrom, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PlaceSummary } from 'src/app/shared/place.model';
import { normalizeCategory } from '../utils/map-icon.util';
normalizeCategory;

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  public allPlaces: PlaceSummary[] = [];
  private isLoaded: boolean = false;

  private http = inject(HttpClient);

  async loadAllPlacesOnce(): Promise<void> {
    // 1. Có dữ liệu rồi thì ko gọi API
    if (this.isLoaded) {
      return;
    }

    // 2. Gọi tới http://localhost:3000/api/places
    try {
      const url = `${environment.apiUrl}/api/places`;
      const response = await lastValueFrom(this.http.get<any>(url));

      if (response && response.data) {
        this.allPlaces = response.data;
        console.log(this.allPlaces);
        this.isLoaded = true;
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu bản đồ:', error);
      this.allPlaces = [];
    }
  }

  getPlacesInBounds(
    sw: any,
    ne: any,
    selectedCategories: string[],
  ): Observable<any[]> {
    if (!this.allPlaces || !Array.isArray(this.allPlaces)) {
      this.allPlaces = [];
    }
    // 1. Lọc các địa điểm nằm trong khung hình (so sánh tọa độ)
    let visiblePlaces = this.allPlaces.filter((place) => {
      // 1. Lọc địa điểm theo tọa độ (màn hình người dùng)
      const isInsideLat = place.lat >= sw.lat && place.lat <= ne.lat;
      const isInsideLng = place.lng >= sw.lng && place.lng <= ne.lng;
      const inBounds = isInsideLat && isInsideLng;

      // 2. Lọc theo danh mục
      const normalizedCat = normalizeCategory(place.category);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(normalizedCat);
      return inBounds && matchesCategory;
    });

    // 2. Sắp xếp theo Rating từ cao xuống thấp
    visiblePlaces.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return ratingB - ratingA;
    });

    // 3. Chọn top 50 địa điểm
    const top50Places = visiblePlaces.slice(0, 50);
    return of(top50Places);
  }
}
