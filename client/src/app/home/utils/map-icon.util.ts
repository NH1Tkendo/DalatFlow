import * as L from 'leaflet';

const ICON_PATHS: any = {
  restaurant:
    'M280-80v-366q-51-14-85.5-56T160-600v-280h80v280h40v-280h80v280h40v-280h80v280q0 56-34.5 98T360-446v366h-80Zm400 0v-320H560v-280q0-83 58.5-141.5T760-880v800h-80Z',
  attraction:
    'M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z', // Mã icon camera
  hotel:
    'M40-200v-600h80v400h320v-320h320q66 0 113 47t47 113v360h-80v-120H120v120H40Zm155-275q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35Zm325 75h320v-160q0-33-23.5-56.5T760-640H520v240ZM308.5-531.5Q320-543 320-560t-11.5-28.5Q297-600 280-600t-28.5 11.5Q240-577 240-560t11.5 28.5Q263-520 280-520t28.5-11.5ZM280-560Zm240-80v240-240Z',
  atm: 'M880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720Zm-720 80h640v-80H160v80Zm0 160v240h640v-240H160Zm0 240v-480 480Z',
  police:
    'M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q97-30 162-118.5T718-480H480v-315l-240 90v207q0 7 2 18h238v316Z',
  medical:
    'M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v480q0 33-23.5 56.5T800-80H160Zm0-80h640v-480H160v480Zm240-560h160v-80H400v80ZM160-160v-480 480Zm280-200v120h80v-120h120v-80H520v-120h-80v120H320v80h120Z',
  khac: 'M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z',
};

const CATEGORY_COLORS: any = {
  restaurant: '#FF9E67', // Cam
  attraction: '#A47AE2', // Tím
  hotel: '#FF7E9C', // Hồng
  atm: '#1976D2', //Xanh dương
  medical: '#2E7D32', // Xanh lá
  police: '#1A237E', // Xanh navy
  khac: '#808080', //Xám
};

const CATEGORY_MAP: Record<string, string> = {
  // Nhóm Ăn uống
  'nhà hàng': 'restaurant',
  'quán ăn nhỏ': 'restaurant',
  'quán ăn': 'restaurant',
  'quán cà phê': 'restaurant',
  'cà phê': 'restaurant',
  'trà trân châu': 'restaurant',

  // Nhóm Tham quan
  'điểm thu hút khách du lịch': 'attraction',
  vườn: 'attraction',
  'vườn thực vật': 'attraction',
  'đại lý du lịch tham quan': 'attraction',
  'dịch vụ nông nghiệp': 'attraction',
  'quảng trường': 'attraction',

  // Nhóm Lưu trú
  hotel: 'hotel',
  homestay: 'hotel',
  lodging: 'hotel',
  'khách sạn lưu trú dài hạn': 'hotel',
  'nhà nghỉ': 'hotel',
  'youth hostel': 'hotel',

  // Nhóm Tiện ích
  atm: 'atm',
  'cảnh sát dân sự': 'police',
  'công an': 'police',
  'cảnh sát tiểu bang': 'police',
  'cửa hàng bán thuốc': 'medical',
  'cửa hàng thuốc': 'medical',
  'hiệu thuốc': 'medical',
};

export function normalizeCategory(rawCategory: any): string {
  // Lớp khiên 1: Chặn ngay nếu data rỗng (null, undefined, '')
  if (!rawCategory) return 'attraction';

  // Lớp khiên 2: Xử lý nếu category bị bọc trong mảng (VD: ["Quán cà phê"])
  let catString = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;

  // Lớp khiên 3: Bắt thóp trường hợp mảng rỗng [] khiến catString bị undefined
  if (catString === undefined || catString === null) return 'attraction';

  // DÒNG QUYẾT ĐỊNH (Thay thế hoàn toàn .toString() bằng String(...))
  catString = String(catString).toLowerCase().trim();

  // Tra từ điển (Đảm bảo bạn đã có biến CATEGORY_MAP ở trên nhé)
  return CATEGORY_MAP[catString] || 'khac';
}

export function createPin(category: string): L.DivIcon {
  const normalizedKey = normalizeCategory(category);

  const bgColor = CATEGORY_COLORS[normalizedKey] || '#808080';
  const iconPath = ICON_PATHS[normalizedKey] || ICON_PATHS['khac'];

  const svgString = `
    <svg viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0c-8.8 0-16 7.2-16 16 0 11.5 16 24 16 24s16-12.5 16-24c0-8.8-7.2-16-16-16z" fill="#FFFFFF"/>
      
      <path d="M16 2c-7.7 0-14 6.3-14 14 0 10 14 21 14 21s14-11 14-21c0-7.7-6.3-14-14-14z" fill="${bgColor}"/>
      
      <svg x="6" y="4" width="20" height="20" viewBox="0 -960 960 960">
        <path d="${iconPath}" fill="#FFFFFF"/>
      </svg>
    </svg>
  `;

  return L.divIcon({
    className: 'clear-background',
    html: `<div style="width: 32px; height: 40px; drop-shadow(0px 2px 4px rgba(0,0,0,0.4));">${svgString}</div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -38],
  });
}
