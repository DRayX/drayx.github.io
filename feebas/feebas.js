import {TILE_DATA} from './tiles.js';
import {loadImage} from './util.js';

const TILE_SIZE = 16;

function draw(canvas, map, lotto) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(map, 0, 0);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  for (var x = 0; x <= canvas.width; x += TILE_SIZE) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (var y = 0; y <= canvas.height; y += TILE_SIZE) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  ctx.stroke();
  const seed_pos = (lotto * 0xeb65 + 0xa683) & 0xffff;
  const seed_neg = 0x10000 - seed_pos;
  const location_low_pos = TILE_DATA[0x18f + (seed_pos & 0xff) % 0x84];
  const location_low_neg = TILE_DATA[0x18f + (seed_neg & 0xff) % 0x84];
  const location_high_pos = TILE_DATA[0x10a + (seed_pos >> 8) % 0x84];
  const location_high_neg = TILE_DATA[0x10a + (seed_neg >> 8) % 0x84];
  ctx.fillStyle = 'green';
  for (const [color, locations] of Object.entries({
      'green': [location_low_pos, location_high_pos],
      'red': [location_low_neg, location_high_neg],
  })){
    ctx.fillStyle = color;
    for (const loc of locations) {
      ctx.fillRect(
          0.5 + (loc[0] - TILE_DATA[0][0]) * TILE_SIZE,
          0.5 + (loc[1] - TILE_DATA[0][1]) * TILE_SIZE,
          TILE_SIZE - 1,
          TILE_SIZE - 1);
    }
  }
}

(async function() {
  const map = await loadImage('./map.png');
  const canvas = document.getElementById('canvas');
  [canvas.width, canvas.height] = [map.width, map.height];
  const ctx = canvas.getContext('2d');
  const input = document.getElementById('lottery');
  input.addEventListener('input', () => draw(canvas, map, input.value));
  draw(canvas, map, input.value);
})();
