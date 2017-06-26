(function () {
'use strict';

var canvas = document.querySelector('canvas');
var master = canvas.getContext('2d');
var buffer = canvas.cloneNode().getContext('2d');

var source = document.createElement('img');
var output = master.getImageData(0, 0, canvas.width, canvas.height);

var workerBlob = new Blob([document.getElementById('worker').textContent]);
var workerBlobUrl = (window.URL || window.webkitURL).createObjectURL(workerBlob);
var worker = new Worker(workerBlobUrl);

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

var toggle = false;

canvas.addEventListener('click', function (e) {
  e.preventDefault();

  if (toggle) {
    master.drawImage(source, 0, 0);
  } else {
    buffer.putImageData(output, 0, 0);

    master.save();
    master.translate(master.canvas.width * 0.5, master.canvas.height * 0.5);
    master.rotate(-Math.PI * 0.5);
    master.drawImage(buffer.canvas, -master.canvas.width * 0.5, -master.canvas.height * 0.5);
    master.restore();
  }

  toggle = !toggle;
}, false);

worker.addEventListener('message', function (e) {
  output.data.set(e.data.result.data);
});

source.addEventListener('load', function () {
  buffer.translate(buffer.canvas.width * 0.5, buffer.canvas.height * 0.5);
  buffer.rotate(Math.PI * 0.5);
  buffer.drawImage(source, -buffer.canvas.width * 0.5, -buffer.canvas.height * 0.5);
  master.drawImage(source, 0, 0);
  worker.postMessage({ source: buffer.getImageData(0, 0, canvas.width, canvas.height) });
});

source.setAttribute('src', 'master.jpg');

}());
