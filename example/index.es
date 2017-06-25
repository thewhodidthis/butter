const canvas = document.querySelector('canvas');
const source = canvas.getContext('2d');
const filter = canvas.cloneNode().getContext('2d');

const master = document.createElement('img');
const output = source.getImageData(0, 0, canvas.width, canvas.height);

const workerBlob = new Blob([document.getElementById('worker').textContent]);
const workerBlobUrl = (window.URL || window.webkitURL).createObjectURL(workerBlob);
const worker = new Worker(workerBlobUrl);

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

let toggle = false;

canvas.addEventListener('click', (e) => {
  e.preventDefault();

  if (toggle) {
    source.drawImage(master, 0, 0);
  } else {
    filter.putImageData(output, 0, 0);

    source.save();
    source.translate(source.canvas.width * 0.5, source.canvas.height * 0.5);
    source.rotate(-Math.PI * 0.5);
    source.drawImage(filter.canvas, -source.canvas.width * 0.5, -source.canvas.height * 0.5);
    source.restore();
  }

  toggle = !toggle;
}, false);

worker.addEventListener('message', (e) => {
  output.data.set(e.data.result.data);
});

master.addEventListener('load', () => {
  filter.translate(filter.canvas.width * 0.5, filter.canvas.height * 0.5);
  filter.rotate(Math.PI * 0.5);
  filter.drawImage(master, -filter.canvas.width * 0.5, -filter.canvas.height * 0.5);
  source.drawImage(master, 0, 0);
  worker.postMessage({ source: filter.getImageData(0, 0, canvas.width, canvas.height) });
});

master.setAttribute('src', '/master.jpg');

