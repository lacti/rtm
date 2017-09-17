class Rtm {

  constructor() {
  }
}

const rtm = new Rtm();

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
console.log('hello!');

const ctx = canvas.getContext("2d");
console.log(ctx);
if (ctx) {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0, 0, 150, 75);
}