// Service worker. Vive en el telefono fuera de cualquier pestana.
// Se despierta cuando llega un push, aunque Chrome este cerrado.

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
  var body = 'Partida encontrada';
  if (event.data) {
    try {
      var payload = event.data.json();
      body = payload.body || body;
    } catch (e) {
      body = event.data.text() || body;
    }
  }

  event.waitUntil(
    self.registration.showNotification('Partida encontrada', {
      body: body,
      // tag + renotify: una sola notificacion en la bandeja, pero vuelve a sonar
      tag: 'lol-queue',
      renotify: true,
      vibrate: [300, 150, 300, 150, 300],
      silent: false,
      data: { at: Date.now() }
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      if (list.length) return list[0].focus();
      return self.clients.openWindow('./');
    })
  );
});
