// A simple service worker that allows the app to be installed as a PWA
self.addEventListener("install", (event) => {
  console.log("Service worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

self.addEventListener("fetch", (event) => {
  // A fetch handler is required by Chrome to pass the PWA criteria.
  // We'll just pass through the requests.
  event.respondWith(fetch(event.request));
});
