export const CITIES = [
  { id: 'hanoi', name: 'Hà Nội', lat: 21.0285, lng: 105.8542 },
  { id: 'haiphong', name: 'Hải Phòng', lat: 20.8449, lng: 106.6881 },
  { id: 'hue', name: 'Huế', lat: 16.4637, lng: 107.5909 },
  { id: 'danang', name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022 },
  { id: 'nhatrang', name: 'Nha Trang', lat: 12.2388, lng: 109.1967 },
  { id: 'dalat', name: 'Đà Lạt', lat: 11.9404, lng: 108.4583 },
  { id: 'hcm', name: 'TP. Hồ Chí Minh', lat: 10.8231, lng: 106.6297 },
  { id: 'cantho', name: 'Cần Thơ', lat: 10.0452, lng: 105.7469 },
];
export const getWeatherInfo = (code) => {
  if (code === 0) return { description: 'Trời quang' };
  if (code >= 1 && code <= 3) return { description: 'Ít mây / Nhiều mây' };
  if (code >= 45 && code <= 48) return { description: 'Sương mù' };
  if (code >= 51 && code <= 67) return { description: 'Mưa rào / Mưa phùn' };
  if (code >= 71 && code <= 77) return { description: 'Tuyết rơi' };
  if (code >= 80 && code <= 82) return { description: 'Mưa lớn' };
  if (code >= 95) return { description: 'Mưa dông' };
  return { description: 'Không xác định'};
};