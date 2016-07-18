
'use strict';

// console.log('SW Started', self);

self.addEventListener('install', function(event) {
  self.skipWaiting();
  // console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  // console.log('Activated', event);
});

self.addEventListener('push', function(event) {
  console.log('Push message', event);
  if (event.data) {
    const dataText = event.data.text();
    console.warn("We got text", dataText)
  }
  var title = 'TestRunner';

  event.waitUntil(
    self.registration.showNotification(title, {
      'body': 'New Test Results',
      'icon': 'favicon.ico'
    }));
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag', event.notification.tag);
  // Android doesn't close the notification when you click it
  // See http://crbug.com/463146
  event.notification.close();
  var url = 'https://youtu.be/gYMkEMCHtJ4';
  // Check if there's already a tab open with this URL.
  // If yes: focus on the tab.
  // If no: open a tab with the URL.
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(windowClients) {
      console.log('WindowClients', windowClients);
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        console.log('WindowClient', client);
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
