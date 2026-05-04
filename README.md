# 🏔️ DalatFlow - AI-Powered Da Lat Itinerary Planner

<div align="center">

[![Angular](https://img.shields.io/badge/Angular-20.0-DD0031?style=flat-square&logo=angular)](https://angular.io/)
[![Ionic](https://img.shields.io/badge/Ionic-8.0-3880FF?style=flat-square&logo=ionic)](https://ionicframework.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Database-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=flat-square&logo=leaflet)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

_Khám phá thành phố ngàn hoa một cách thông minh với AI_

[Tính Năng](#-tính-năng-chính) • [Cài Đặt](#-hướng-dẫn-cài-đặt) • [Sử Dụng](#-hướng-dẫn-sử-dụng) • [Tài Nguyên](#-tài-nguyên-phát-triển)

</div>

---

## 📱 Giới Thiệu

**DalatFlow** là một ứng dụng di động (web/mobile) thông minh cho phép bạn lên kế hoạch du lịch tại thành phố Đà Lạt một cách tự động sử dụng công nghệ **Artificial Intelligence**.

Thay vì lên kế hoạch thủ công, DalatFlow sẽ giúp bạn:

- 🤖 Tự động gợi ý lịch trình du lịch dựa trên sở thích của bạn
- 🗺️ Hiển thị các địa điểm du lịch trên bản đồ tương tác
- 📅 Tối ưu hóa thứ tự tham quan dựa trên vị trí địa lý
- 💾 Lưu trữ lịch trình để sử dụng sau
- ⏱️ Tính toán thời gian di chuyển giữa các điểm

---

## 🌟 Tính Năng Chính

### 🤖 **AI-Powered Recommendation Engine**

- Sử dụng Google Generative AI để gợi ý lịch trình cá nhân hóa
- Tối ưu hóa dựa trên thời gian, sở thích và thời tiết

### 🗺️ **Interactive Map Interface**

- Xem tất cả các điểm du lịch trên bản đồ tương tác (Leaflet)
- Clustering thông minh cho dễ dàng điều hướng
- Tìm kiếm và lọc địa điểm theo danh mục

### 📋 **Itinerary Management**

- Tạo, chỉnh sửa, xóa lịch trình
- Sao lưu lịch trình trên Firebase Cloud
- Chia sẻ lịch trình với bạn bè

### 📱 **Cross-Platform Support**

- Web App: Chạy trên trình duyệt desktop/mobile
- Mobile App: Hỗ trợ iOS/Android thông qua Capacitor

### 🔐 **Authentication & Data Security**

- Đăng nhập an toàn với Firebase Authentication
- Mã hóa dữ liệu và đồng bộ cloud

### 🌍 **Offline Support**

- Ionic Storage cho offline caching
- Tự động đồng bộ khi có kết nối

---

## 📸 Ảnh Chụp Màn Hình

### Giao Diện Bản Đồ

```
┌─────────────────────────────────────────┐
│  📍 DalatFlow Map                    [≡] │
├─────────────────────────────────────────┤
│                                         │
│    🗺️  [Bản đồ tương tác với marker]    │
│        [Hiển thị các điểm du lịch]      │
│        [Clustering thông minh]          │
│                                         │
└─────────────────────────────────────────┘
```

### Tạo Lịch Trình

```
┌─────────────────────────────────────────┐
│  ✨ Create Itinerary                 [✓] │
├─────────────────────────────────────────┤
│                                         │
│  📅 Date: [Select Date]                 │
│  ⏰ Duration: [1-7 days]                 │
│  💭 Interests: [Tourism][Adventure]     │
│  👥 Budget: [Low][Medium][High]         │
│                                         │
│  [🤖 Generate with AI]                  │
│                                         │
└─────────────────────────────────────────┘
```

### Danh Sách Lịch Trình

```
┌─────────────────────────────────────────┐
│  📋 My Itineraries                   [+] │
├─────────────────────────────────────────┤
│                                         │
│  [Day 1: Mountain Adventure]         [→] │
│  [Day 2-3: City Exploration]        [→] │
│  [Weekend Getaway]                  [→] │
│                                         │
└─────────────────────────────────────────┘
```

> **Lưu ý:** Các ảnh thực tế sẽ được cập nhật sau khi ứng dụng được triển khai

---

## 🚀 Hướng Dẫn Cài Đặt

### ✅ Yêu Cầu Tiên Quyết

- **Node.js**: v18.0.0 hoặc cao hơn ([Tải về](https://nodejs.org/))
- **npm** hoặc **yarn**: Công cụ quản lý gói
- **Git**: Để clone repository
- **VS Code** (tùy chọn): Trình soạn thảo code

Kiểm tra phiên bản:

```powershell
node --version    # v18.x.x
npm --version     # 9.x.x
git --version     # 2.x.x
```

### 📥 Bước 1: Clone Repository

```powershell
# Clone dự án
git clone https://github.com/your-username/DalatFlow.git

# Vào thư mục dự án
cd DalatFlow
```

### ⚙️ Bước 2: Cấu Hình Environment

#### **Server Configuration (.env)**

Tạo file `.env` trong thư mục `server`:

```bash
cd server
```

Tạo file `.env`:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# Google Generative AI
GOOGLE_API_KEY=your-google-generative-ai-key

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:4200
```

**Cách lấy các key:**

1. **Firebase Keys**: Truy cập [Firebase Console](https://console.firebase.google.com/)
   - Tạo hoặc chọn dự án
   - Settings → Service Accounts → Generate new private key
   - Copy giá trị vào file `.env`

2. **Google Generative AI Key**: Truy cập [Google AI Studio](https://aistudio.google.com/)
   - Tạo API Key mới
   - Copy vào `GOOGLE_API_KEY`

#### **Client Configuration (environment.ts)**

File `client/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:YOUR_APP_ID:web:YOUR_WEB_APP_ID",
  },
  apiUrl: "http://localhost:3000",
};
```

### 📦 Bước 3: Cài Đặt Dependencies

#### **Server Dependencies**

```powershell
# Vẫn trong thư mục server
cd server

# Cài đặt npm packages
npm install

# Hoặc sử dụng yarn
yarn install
```

Các package chính:

- `express`: Web framework
- `cors`: Cross-origin requests
- `firebase-admin`: Firebase integration
- `@google/genai`: AI recommendation engine
- `dotenv`: Environment configuration

#### **Client Dependencies**

```powershell
# Mở terminal mới, vào thư mục client
cd client

# Cài đặt npm packages
npm install

# Hoặc sử dụng yarn
yarn install
```

Các package chính:

- `@angular/core`: Frontend framework
- `@ionic/angular`: Mobile UI components
- `leaflet`: Interactive maps
- `firebase`: Authentication & database
- `rxjs`: Reactive programming

### 🎯 Bước 4: Khởi Chạy Ứng Dụng

#### **Khởi Chạy Server (Node.js Backend)**

```powershell
# Mở terminal (PowerShell)
cd D:\DalatFlow\server

# Chạy server ở chế độ development
npm run dev

# Output mong đợi:
# Server is running on http://localhost:3000
```

Server sẽ:

- Lắng nghe trên `http://localhost:3000`
- Hỗ trợ CORS cho `http://localhost:4200`
- Kết nối tới Firebase
- Cung cấp AI recommendation endpoint

#### **Khởi Chạy Client (Angular/Ionic Frontend)**

```powershell
# Mở terminal mới
cd D:\DalatFlow\client

# Chạy Angular development server
npm start

# Output mong đợi:
# ✔ Compiled successfully
# Local:   http://localhost:4200/
```

Client sẽ:

- Chạy trên `http://localhost:4200`
- Tự động reload khi bạn thay đổi code
- Kết nối tới server backend tại `http://localhost:3000`

### ✅ Bước 5: Xác Minh Cài Đặt

Mở trình duyệt và truy cập:

- **Client**: http://localhost:4200
- **Server API**: http://localhost:3000

Bạn sẽ thấy:

- ✅ Ứng dụng Angular/Ionic load thành công
- ✅ Bản đồ Leaflet hiển thị
- ✅ Có thể đăng nhập với Firebase
- ✅ Có thể tạo lịch trình mới

---

## 💻 Hướng Dẫn Sử Dụng

### 🔐 Đăng Nhập & Đăng Ký

1. Nhấn **"Login"** hoặc **"Sign Up"**
2. Nhập email và password
3. Hoặc đăng nhập bằng Google/Facebook

### 🗺️ Khám Phá Bản Đồ

1. Màn hình chính hiển thị bản đồ Đà Lạt
2. Click vào marker để xem chi tiết địa điểm
3. Sử dụng thanh tìm kiếm để lọc địa điểm
4. Zoom in/out bằng scroll mouse

### ✨ Tạo Lịch Trình AI

1. Nhấn nút **"+"** hoặc **"Create Itinerary"**
2. Chọn các tham số:
   - 📅 Ngày khởi hành
   - ⏰ Số ngày du lịch
   - 💭 Sở thích (Mountain, Culture, Adventure, Food, etc.)
   - 👥 Số người
   - 💰 Ngân sách

3. Nhấn **"Generate with AI"**
4. Chờ AI tạo lịch trình tối ưu
5. Review và chỉnh sửa nếu cần
6. Lưu lịch trình

### 📍 Quản Lý Lịch Trình

- **Xem**: Nhấn vào lịch trình để xem chi tiết
- **Chỉnh sửa**: Sửa đổi địa điểm, thời gian
- **Xóa**: Xóa lịch trình không cần thiết
- **Chia sẻ**: Sao chép link để chia sẻ
- **Xuất**: Tải về dạng PDF/Excel

---

## 🛠️ Cấu Trúc Dự Án

```
DalatFlow/
├── client/                    # Angular/Ionic Frontend
│   ├── src/
│   │   ├── app/              # Angular components & services
│   │   ├── assets/           # Images, icons, static files
│   │   ├── environments/      # Firebase config
│   │   └── theme/            # Ionic styling
│   ├── package.json
│   └── angular.json
│
├── server/                    # Node.js/Express Backend
│   ├── controllers/          # API request handlers
│   ├── services/             # Business logic
│   ├── routes/               # API endpoints
│   ├── middleware/           # Authentication, validation
│   ├── config/               # Configuration files
│   ├── server.js             # Entry point
│   └── package.json
│
└── README.md                  # This file
```

---

## 📚 Tài Nguyên Phát Triển

### API Documentation

**Base URL**: `http://localhost:3000`

#### Itinerary Endpoints

```
POST   /api/itineraries           # Tạo lịch trình mới
GET    /api/itineraries           # Lấy danh sách lịch trình
GET    /api/itineraries/:id       # Lấy chi tiết lịch trình
PUT    /api/itineraries/:id       # Cập nhật lịch trình
DELETE /api/itineraries/:id       # Xóa lịch trình
```

#### AI Recommendation Endpoint

```
POST   /api/generate-itinerary
Body: {
  date: "2026-05-15",
  duration: 3,
  interests: ["nature", "culture", "food"],
  budget: "medium"
}
```

### Thư Viện & Framework

| Thư Viện       | Phiên Bản | Mục Đích             |
| -------------- | --------- | -------------------- |
| **Angular**    | 20.0      | Frontend framework   |
| **Ionic**      | 8.0       | Mobile UI components |
| **Leaflet**    | 1.9.4     | Interactive maps     |
| **Firebase**   | 12.11     | Auth & Database      |
| **Express**    | 4.18      | Backend API          |
| **TypeScript** | Latest    | Type-safe code       |
| **RxJS**       | 7.8       | Reactive programming |

### Tài Liệu Tham Khảo

- [Angular Documentation](https://angular.io/docs)
- [Ionic Framework](https://ionicframework.com/docs)
- [Leaflet Map Library](https://leafletjs.com/)
- [Firebase Guides](https://firebase.google.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [Google Generative AI](https://ai.google.dev/)

---

## 🔧 Lệnh Hữu Ích

### Server Commands

```powershell
# Development mode (auto-reload)
npm run dev

# Production mode
npm run start

# Stop server
npm run stop

# Install dependencies
npm install
```

### Client Commands

```powershell
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Build for Capacitor (mobile)
npm run build
# npx cap sync
```

---

## 🐛 Troubleshooting

### Problem: Server không kết nối được Firebase

**Solution:**

1. Kiểm tra file `.env` có đầy đủ Firebase keys
2. Đảm bảo Firebase project active
3. Kiểm tra internet connection

### Problem: Client không kết nối được Server

**Solution:**

1. Kiểm tra server đang chạy trên port 3000
2. Kiểm tra `apiUrl` trong `environment.ts` đúng
3. Kiểm tra CORS configuration trong server

### Problem: Bản đồ không hiển thị

**Solution:**

1. Kiểm tra Leaflet CSS được load: `node_modules/leaflet/dist/leaflet.css`
2. Refresh trình duyệt (Ctrl+Shift+R)
3. Kiểm tra console có lỗi

### Problem: npm install thất bại

**Solution:**

```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -Recurse -Force node_modules

# Reinstall
npm install
```

---

## 🤝 Đóng Góp

Chúng tôi chào đón mọi đóng góp! Để đóng góp:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

---

## 📄 Giấy Phép

Dự án này được cấp phép dưới [MIT License](LICENSE)

---

## 📧 Liên Hệ & Hỗ Trợ

- **Email**: support@dalatflow.com
- **Issues**: [GitHub Issues](https://github.com/your-username/DalatFlow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/DalatFlow/discussions)

---

## 🙏 Cảm Ơn

Cảm ơn tất cả những người đã đóng góp và hỗ trợ cho dự án DalatFlow!

**Built with ❤️ for Da Lat Lovers**

<div align="center">

**[Lên Đầu](#-dalatflow---ai-powered-da-lat-itinerary-planner)**

</div>
