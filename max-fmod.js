const FMOD = require('./fmod.js');
const Max = require('max-api');

let eventPath = null;
let presetPath = null;

(async function main() {
  await FMOD.start();

  Max.addHandler("play", (path) => {
    eventPath = path;
    FMOD.evoke(`
      var event = studio.project.lookup("${eventPath}");
      var parameter = null;
      event.play();
    `);
  });

  Max.addHandler("stop", () => {
    if (eventPath !== null) {
      FMOD.evoke(`
        event.stopNonImmediate();
        event = null;
        parameter = null;
      `);

        eventPath = null;
        presetPath = null;
      }
  });

  Max.addHandler("set", (path, value) => {
    if (eventPath !== null) {
      if (path !== presetPath) {
        presetPath = path;

        FMOD.evoke(`
          parameter = studio.project.lookup("${path}").parameter;
          event.setCursorPosition(parameter, ${value});
        `);
      } else {
        FMOD.evoke(`
          event.setCursorPosition(parameter, ${value});
        `);  
      }
    }
  });
})();
