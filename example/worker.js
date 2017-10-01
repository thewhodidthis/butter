importScripts('butter.js');

self.addEventListener('message', function (e) {
  var filter = butter(e.data.config);

  self.postMessage({ result: filter(e.data.source) });
});
