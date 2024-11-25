const FMOD = require('./fmod.js');
const Max = require('max-api');

let eventPath = null;
let parameterPath = null;

(async function main() {
  await FMOD.start();

  Max.addHandler("event", (path = null) => {
    if (path !== null) {
      if (path !== eventPath) {
        eventPath = path;

        FMOD.evoke(`
          var event = studio.project.lookup("event:${path}");
          studio.window.navigateTo(event);
        `);
      }
    } else {
      console.error('missing event path');
    }
  });

  Max.addHandler("parameter", (path = null) => {
    if (path !== null) {
      if (path !== parameterPath) {
        parameterPath = path;

        FMOD.evoke(`
          var parameter = studio.project.lookup("parameter:${path}").parameter;
        `);
      }
    } else {
      console.error('missing parameter path');
    }
  });

  Max.addHandler("play", () => {
    if (eventPath !== null) {
      FMOD.evoke(`
        event.play();
      `);
    } else {
      console.error('event path not defined');
    }
  });

  Max.addHandler("stop", () => {
    if (eventPath !== null) {
      FMOD.evoke(`
        event.stopNonImmediate();
      `);
    } else {
      console.error('event path not defined');
    }
  });

  Max.addHandler("set", (value) => {
    if (eventPath !== null && parameterPath !== null) {
      FMOD.evoke(`
        event.setCursorPosition(parameter, ${value});

        if (!event.isPlaying()) {
          event.play();
        }
      `);
    } else if (eventPath === null && parameterPath === null) {
      console.error('event and parameter path not defined');
    } else if (eventPath === null) {
      console.error('event path not defined');
    } else if (parameterPath === null) {
      console.error('parameter path not defined');
    }
  });
})();
