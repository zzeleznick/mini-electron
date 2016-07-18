
'use strict';

// console.log('SW Started', self);
var TITLE = 'TestRunner';
var BODY = 'New Test Results';
var URL = "http://google.com";

self.addEventListener('message', function (evt) {
  console.log('postMessage received', evt.data);
  const username = evt.data.username;
  if (username) {
    BODY = "New Test Results for " + username;
  }
})

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

  event.waitUntil(
    self.registration.showNotification(TITLE, {
      'body': BODY,
      'icon': 'favicon.ico'
    }));
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag', event.notification.tag);
  // Android doesn't close the notification when you click it
  // See http://crbug.com/463146
  event.notification.close();
  var url = URL;
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
