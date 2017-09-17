
const r = {
  car: {
    w: 32, h: 40
  },
  tick: {
    move: 400
  }
}

const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext('2d')
console.log(ctx)

const drawers = {
  fillBackground: (color) => {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}
const loadResource = (path, afterLoaded) => {
  const resources = document.getElementById('resources')
  const img = document.createElement('img')
  img.src = path
  img.addEventListener('load', () => afterLoaded(img))
  resources.appendChild(img)
}

const loadResources = (afterLoaded) => {
  loadResource('images/car.png', (img) => {
    drawers.drawCar = (index, x, y, sprite) => {
      ctx.drawImage(img, r.car.w * index, sprite * r.car.h, r.car.w, r.car.h, x, y, r.car.w, r.car.h)
    }
    afterLoaded()
  })
}

class Camera {
  me(me) {
    this.me = me
  }
  update() {
    const pos = this.me.pos();
    this.x = pos.x
    this.y = pos.y
  }
  translate(pos) {
    return {
      x: canvas.width / 2 + (pos.x - this.x),
      y: canvas.height * 2 / 3 - (pos.y - this.y)
    }
  }
}
const camera = new Camera()

class TimeGauge {
  constructor(interval, chooses) {
    this.interval = interval
    this.chooses = chooses
  }
  update(delta) {
    this.progress = (this.progress || 0) + delta
    const current = parseInt(this.progress / this.interval)
    if (current != this.previous) {
      this.index = ((this.index || 0) + 1) % this.chooses.length
    }
    this.previous = current
    return this.chooses[this.index]
  }
}
class CarRO {
  constructor(index, initPos) {
    this.index = index
    this.from = this.to = (initPos || { x: 0, y: 0 })
    this.sprite = new TimeGauge(128, [0, 1]);
  }
  update(dt) {
    let x = this.to.x * r.car.w
    let y = this.to.y * r.car.h
    if (this.state === 'move') {
      this.moveTick += dt
      if (this.moveTick > r.tick.move) {
        this.from = this.to
        this.state = 'stop'
        this.moveTick = 0
      }
      x = ((this.to.x - this.from.x) * (this.moveTick / r.tick.move) + this.from.x) * r.car.w
      y = ((this.to.y - this.from.y) * (this.moveTick / r.tick.move) + this.from.y) * r.car.h
    }
    this.x = x
    this.y = y
  }
  move(dest) {
    this.to = dest
    this.moveTick = 0
    this.state = 'move'
  }
  pos() {
    return { x: this.x, y: this.y }
  }
  draw(dt) {
    let pos = camera.translate(this.pos())
    drawers.drawCar(this.index, pos.x, pos.y, this.sprite.update(dt))
  }
}

const cars = []
const car = new CarRO(0)
const car2 = new CarRO(1, { x: 1, y: 0 })

cars.push(car)
cars.push(car2)

camera.me(car)

let y = canvas.height - 50
const render = (dt) => {
  drawers.fillBackground('#888888')
  cars.forEach(each => each.update(dt))
  camera.update()
  cars.forEach(each => each.draw(dt))
}

loadResources(() => {
  let lastRender = 0
  const renderLoop = (timestamp) => {
    const delta = timestamp - (lastRender || timestamp)
    render(delta)
    lastRender = timestamp
    window.requestAnimationFrame(renderLoop)
  }
  window.requestAnimationFrame(renderLoop)
});
