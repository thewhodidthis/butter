(function () {
'use strict';

var images = document.querySelectorAll('li > img');
var boards = document.querySelectorAll('canvas');

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

var params = [
  { threshold: '332200', up: true },
  { threshold: '77838c' },
  { threshold: '81aeb6', up: true, flip: true }
];

Array.from(images).map(function (img) { return img.src; }).forEach(function (file, i) {
  var config = params[i];
  var canvas = boards[i];
  var master = canvas.getContext('2d');
  var buffer = canvas.cloneNode().getContext('2d');

  var source = document.createElement('img');
  var output = master.getImageData(0, 0, canvas.height, canvas.width);
  var worker = new Worker('worker.js');

  worker.addEventListener('message', function (e) {
    output.data.set(e.data.result.data);
    buffer.putImageData(output, 0, 0);

    master.save();

    if (config.up) {
      master.translate(0, canvas.height);
      master.rotate(-Math.PI * 0.5);
    }

    master.drawImage(buffer.canvas, 0, 0);
    master.restore();
  });

  source.addEventListener('load', function () {
    var angle = config.up ? Math.PI * 0.5 : 0;
    var shift = config.up ? -1 * canvas.height : 0;

    buffer.rotate(angle);
    buffer.drawImage(source, 0, shift);

    worker.postMessage({
      config: config,
      source: buffer.getImageData(0, 0, canvas.height, canvas.width)
    });
  });

  source.setAttribute('src', file);
});

}());

