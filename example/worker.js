importScripts('butter.js');

self.addEventListener('message', function (e) {
  var filter = Butter(e.data.config);

  self.postMessage({ result: filter(e.data.source) });
});
