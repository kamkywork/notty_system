const CACHE_NAME = 'notty-app-system-v6'; // <--- เปลี่ยนเลขตรงนี้ทุกครั้งที่อัปเดตเว็บ (v3, v4, v5...)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // ใส่ไฟล์อื่นๆ ที่ต้องการ cache ที่นี่
];

// 1. Install Service Worker และจำไฟล์
self.addEventListener('install', function(event) {
  // บังคับให้ Service Worker ใหม่ทำงานทันทีไม่ต้องรอ
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activate และลบ Cache เก่าทิ้ง (ส่วนที่คุณขาดไป)
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // ถ้าชื่อ Cache ไม่ตรงกับเวอร์ชันล่าสุด ให้ลบทิ้ง
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // สั่งให้ Service Worker ควบคุมทุกหน้าทันที
  return self.clients.claim();
});

// 3. Fetch ข้อมูล
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // ถ้ามีใน Cache ให้ใช้ Cache (โหลดเร็ว)
        if (response) {
          return response;
        }
        // ถ้าไม่มี ให้โหลดจากเน็ต
        return fetch(event.request);
      })
  );
});