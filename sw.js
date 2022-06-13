const cacheName = 'news-v5';
const staticAssets = [
   './',
   './index.html',
   '/css/index.css',
   '/img/logo.png',
   '/img/icon-192.png',
   '/img/icon-256.png',
   '/img/icon-512.png',
   './js/game.js',
   './js/phaser.min.js',
];
// 第一次是install,activate都会执行
// sw.js没有改动，重复刷新，install,activate不会执行
// 当sw.js发生改变，install会被执行
self.addEventListener('install', async e => {
   const cache = await caches.open(cacheName);
   await cache.addAll(staticAssets);
   return self.skipWaiting();
});
self.addEventListener('activate', e => {
   console.log('activate', e);
   e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', e => {
   // 删除其它缓存
   e.waitUntil(
      caches.keys().then(function (keyList) {
         return Promise.all(keyList.map(function (key) {
            if (key !== cacheName) {
               console.log('sw removing old cache', key);
               return caches.delete(key);
            }
         }));
      })
   );

   const req = e.request;
   const url = new URL(req.url);

   if (url.origin === location.origin) {
      e.respondWith(cacheFirst(req));
   } else {
      e.respondWith(networkAndCache(req));
   }
});

// 缓存优先
async function cacheFirst(req) {
   const cache = await caches.open(cacheName);
   const cached = await cache.match(req);
   return cached || await fetch(req);
}

// 网络优先
async function networkAndCache(req) {
   const cache = await caches.open(cacheName);
   try {
      const fresh = await fetch(req);
      await cache.put(req, fresh.clone()); //储存网络获取的数据
      return fresh;
   } catch (e) {
      const cached = await cache.match(req);
      return cached;
   }
}