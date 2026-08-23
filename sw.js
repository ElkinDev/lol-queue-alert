// Service worker. Vive en el telefono fuera de cualquier pestana.
// Se despierta cuando llega un push, aunque Chrome este cerrado.

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
  var title = 'Cola LoL';
  var body = 'Partida encontrada';
  // Etiqueta por defecto solo si el PC no manda una. La buena viene en el mensaje y
  // es distinta en cada evento, para que un aviso nuevo no reemplace al anterior en
  // silencio cuando el de antes sigue sin leer en la bandeja.
  var tag = 'lol-queue';
  if (event.data) {
    try {
      var payload = event.data.json();
      title = payload.title || title;
      body = payload.body || body;
      tag = payload.tag || tag;
    } catch (e) {
      body = event.data.text() || body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      tag: tag,
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
