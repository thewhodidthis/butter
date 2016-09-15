'use strict';

var html = document.documentElement;

var canvas = document.getElementById('canvas');
var source = canvas.getContext('2d');
var target = source.getImageData(0, 0, canvas.width, canvas.height);
var master = document.createElement('img');

var workerBlob = new Blob([document.getElementById('worker').textContent]);
var workerBlobUrl = (window.URL || window.webkitURL).createObjectURL(workerBlob);
var worker = new Worker(workerBlobUrl);

var isOn = false;

html.className = 'html';

if (window !== window.top) {
  html.className += ' is-iframe';
}

canvas.addEventListener('click', function _onClick(e) {
  e.preventDefault();

  isOn = !isOn;

  if (isOn) {
    source.putImageData(target, 0, 0);
  } else {
    source.drawImage(master, 0, 0);
  }
}, false);

worker.addEventListener('message', function _onDoneProcessing(e) {
  target = e.data.result;
}, false);

master.addEventListener('load', function _onLoad(e) {
  source.drawImage(master, 0, 0);

  // TODO: Rotate source for vertical sorting
  worker.postMessage({
    source: source.getImageData(0, 0, canvas.width, canvas.height)
  });
}, false);

master.setAttribute('src', '/master.jpg');
