const net = require('net');

const host = '127.0.0.1';
const port = 3663;
let socket = new net.Socket();

async function start() {
  return new Promise((resolve) => {
    socket.connect(port, host, async () => {
      console.log(`socket is connected to ${host}:${port}`);

      await evoke();
      resolve();
    });
  });
}

function terminate() {
  socket.destroy();
  socket = null;
}

let resolveFunction = null;

socket.on('data', (data) => {
  if (resolveFunction !== null) {
    if (data.toString().startsWith('out():')) {
      resolveFunction(data.toString('utf-8', 7, data.length - 5));
    } else if (data.toString().startsWith('log():')) {
      //console.log('>', data.toString('utf-8', 7, data.length - 5));
      resolveFunction();
    } else {
      console.error(data.toString());
    }

    resolveFunction = null;
  }
});

socket.on('close', function () {
  console.log('connection closed');
});

async function evoke(command) {
  return new Promise((resolve) => {
    resolveFunction = resolve;

    if (command) {
      socket.write(`${command}\n`);
    }
  });
}

async function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1000 * duration);
  });
}

async function play(eventPath) {
  eventPath = path;

  await FMOD.evoke(`
    var event = studio.project.lookup("${eventPath}");
    event.play();
  `);
}

async function stop(eventPath) {
  await evoke(`
    var event = studio.project.lookup("${eventPath}");
    event.stopNonImmediate();
  `);
}

async function setParameter(eventPath, presetPath, value) {
  await evoke(`
    var event = studio.project.lookup("${eventPath}");
    var preset = studio.project.lookup("${presetPath}");
    event.setCursorPosition(preset, ${value});
  `);
}

exports.start = start;
exports.terminate = terminate;
exports.evoke = evoke;
exports.sleep = sleep;
exports.play = play;
exports.stop = stop;
exports.setParameter = setParameter;
