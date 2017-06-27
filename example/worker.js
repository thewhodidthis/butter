importScripts('butter.js');

self.addEventListener('message', (e) => {
  const filter = Butter({ flip: true });

  self.postMessage({ result: filter(e.data.source) });
});
