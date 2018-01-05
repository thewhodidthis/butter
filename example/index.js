(function () {
'use strict';

var images = document.querySelectorAll('canvas img');
var boards = document.querySelectorAll('canvas');

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

var upward = Math.PI * 0.5;
var params = [
  { threshold: '332200', up: 1 },
  { threshold: '77838c' },
  { threshold: '81aeb6', up: 1, flip: 0 }
];

Array.from(images).map(function (img) { return img.alt; }).forEach(function (src, i) {
  var config = params[i];
  var canvas = boards[i];
  var target = canvas.getContext('2d');

  var a = config.up ? upward : 0;
  var y = config.up ? canvas.height : 0;

  var buffer = canvas.cloneNode().getContext('2d');

  buffer.rotate(a);

  var worker = new Worker('worker.js');

  worker.addEventListener('message', function (e) {
    buffer.putImageData(e.data.result, 0, 0);

    target.save();

    if (config.up) {
      target.translate(0, y);
      target.rotate(-a);
    }

    target.drawImage(buffer.canvas, 0, 0);
    target.restore();
  });

  var master = document.createElement('img');

  master.addEventListener('load', function () {
    buffer.drawImage(master, 0, -y);

    var source = buffer.getImageData(0, 0, canvas.height, canvas.width);

    worker.postMessage({ config: config, source: source });
  });

  master.setAttribute('src', src);
});

}());

