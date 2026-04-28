// 1. MODEL NHẸ (Chỉ chứa các trường sống còn để hiện lên bản đồ)
export interface PlaceSummary {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  rating: number;
}

// 2. MODEL NẶNG (Kế thừa Model nhẹ và cộng thêm tất cả các trường chi tiết)
export interface PlaceDetail extends PlaceSummary {
  description: string;
  photos: string[]; // Mảng chứa 20 cái link ảnh HD
  operatingHours: any; // Giờ mở cửa các ngày trong tuần
  contact: string;
  // ... toàn bộ các field khác của SerpApi
}
