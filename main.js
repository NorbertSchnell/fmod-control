const FMOD = require('./fmod.js');

(async function main() {
  await FMOD.start();

  await FMOD.setParameter('event:/Engine', 'parameter:/RPM', 600);
  await FMOD.play('event:/Engine');
  await FMOD.sleep(1);

  await FMOD.setParameter('event:/Engine', 'parameter:/RPM', 2000);
  await FMOD.sleep(1);

  await FMOD.setParameter('event:/Engine', 'parameter:/RPM', 1000);
  await FMOD.sleep(1);

  await FMOD.stop('event:/Engine');

  FMOD.terminate();
})();
