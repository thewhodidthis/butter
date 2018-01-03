importScripts('filter.js')

self.addEventListener('message', (e) => {
  const filter = butter(e.data.config)

  self.postMessage({
    result: filter(e.data.source)
  })
})
