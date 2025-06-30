'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "ef65c360e53023372788bc6cc42ce579",
"assets/AssetManifest.bin.json": "ae639db0413a00e3a21bc3d1469be958",
"assets/AssetManifest.json": "d32f373437acc96cf28cb7caff47c02d",
"assets/assets/images/bell.png": "929723572aa737a354244ca14fe5659b",
"assets/assets/images/bottle.png": "840d3c89291f9d3b0a859d7479c10d0c",
"assets/assets/intro/A.png": "33f8a1a6952f4fa2e1864ef2797813fd",
"assets/assets/intro/AA.png": "1c375c63489d574383f723fc3b4ffa71",
"assets/assets/intro/aaa.jpg": "4b4d444a09e91153b422280a566f965c",
"assets/assets/intro/care_image.png": "9bf0ea738c1dcabf5650abea1c02e993",
"assets/assets/intro/charco.png": "26c4a07e3f425097cbbfdc4befb27108",
"assets/assets/intro/introduction_animation.png": "309f80cbbe9ba84d2d643677c7853907",
"assets/assets/intro/introduction_image.png": "307c773d181ceeb899559add51c7acb4",
"assets/assets/intro/mood_dairy_image.png": "64172e2be2e435a8a002ee49d83d779b",
"assets/assets/intro/relax_image.png": "750458c224fc63ede91b894cb893fb03",
"assets/assets/intro/w1.svg": "14842c1b9bb0b41de50dd5cd9d7c47c2",
"assets/assets/intro/w2.svg": "bb256348a2e2b8863d9bbe10ac9da5f5",
"assets/assets/intro/w3.svg": "180c46bae205652823d84a069808c1da",
"assets/assets/intro/w4.svg": "cf0709f35950ba41374fe3d0709cb91b",
"assets/assets/intro/w5.svg": "0450eddc44f096f1879e3eaa36060c8e",
"assets/assets/intro/w6.svg": "67a1c3e4b7edf3e486ffda4788edeafa",
"assets/assets/intro/welcome.png": "0b5447c747d72f631c7b92e12f26e2a1",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "228bddfbb7aebd76f32a635761614981",
"assets/NOTICES": "a4891725e5e56e7abc8dbb887ef82ca6",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "140ccb7d34d0a55065fbd422b843add6",
"canvaskit/canvaskit.js.symbols": "867d15540d09106a65fd18e4e83408b3",
"canvaskit/canvaskit.wasm": "5070b29729807b44a517ff8ecdb9e31c",
"canvaskit/chromium/canvaskit.js": "5e27aae346eee469027c80af0751d53d",
"canvaskit/chromium/canvaskit.js.symbols": "56b8de673e91c6624dc16cd0f1f9a838",
"canvaskit/chromium/canvaskit.wasm": "49702d666184f2ea01f8ed6f3cbc2111",
"canvaskit/skwasm.js": "37fdb662bbaa915adeee8461576d69d7",
"canvaskit/skwasm.js.symbols": "021707ff64ac37e2c81850adca34e06f",
"canvaskit/skwasm.wasm": "f821008e63e8b0223476af8e7b5e7df7",
"canvaskit/skwasm_heavy.js": "f5c1413d222bc68856296fc97ac9fec0",
"canvaskit/skwasm_heavy.js.symbols": "4c6915a46a80eab1f5d7d6d435c117ad",
"canvaskit/skwasm_heavy.wasm": "1e8e650beee57cf019dc8aef15f587c4",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "baab3b6ad5e74e3f0d43d96274f5fba9",
"flutter_bootstrap.js": "26933031ee07e37687973e216c30a8e8",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "bf34393d32c37314a91ff86cf1ee17e0",
"/": "bf34393d32c37314a91ff86cf1ee17e0",
"main.dart.js": "9dc9d91d0f06d00610c8318de7585214",
"manifest.json": "220b9bf9652768cfaf9b5fa00f52e685",
"version.json": "6fa8ebc39707218426bef76fa4b28453"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
