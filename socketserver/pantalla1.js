const moment = require('moment');

const pantallaFlujo = [];

let counter = 0;

function updateFlujo() {
  const diff = Math.floor(Math.random() * 1000) / 100;
  let lastTime;
  let flujo;

  if (pantallaFlujo.length > 0) {
    lastTime = moment(pantallaFlujo[0].tiempo, 'HH:mm:ss').add(1, 'seconds');

    if (counter % 2 === 0) {
      flujo = pantallaFlujo[0].flujo + diff;
    } else {
      flujo = Math.abs(pantallaFlujo[0].flujo - diff);
    }
  } else {
    lastTime = moment().startOf('day');
    flujo = diff;
  }

  pantallaFlujo.unshift({
    tiempo: lastTime.format('HH:mm:ss').toString(),
    flujo: Number(flujo.toFixed(2)) // Redondear a 2 decimales
  });
  counter++;
}

module.exports = {
  pantallaFlujo,
  updateFlujo
};
