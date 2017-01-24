/* eslint-env serviceworker, worker */

var currentVersion = 'v0.0.9'

this.addEventListener('install', function (event) {
  console.log('sw: install')
  event.waitUntil(
    caches.open(currentVersion)
    .then(function (cache) {
      return cache.addAll([
        'pdftex-worker.data',
        'pdftex-worker.js',
        'pdftex-worker.js.mem',
        'pdftex.js'
      ])
    })
    .then(function () {
      return self.skipWaiting()
    })
  )
})

this.addEventListener('fetch', function (event) {
  console.log('sw: fetch', event.request.url, event)
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request).then(function (response) {
        return caches.open(currentVersion).then(function (cache) {
          cache.put(event.request, response.clone())
          return response
        })
      })
    })
  )
})

this.addEventListener('activate', function (event) {
  console.log('sw: activate')
  event.waitUntil(
    caches.keys()
    .then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== currentVersion) {
          return caches.delete(key)
        }
      }))
    }).then(function () {
      return self.clients.claim()
    })
  )
})
