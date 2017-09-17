
const r = {
  car: {
    w: 32, h: 40
  },
  tick: {
    move: 400
  }
}

class Camera {
  update() {
    if (this.center) {
      const pos = this.center.pos();
      this.x = pos.x
      this.y = pos.y
    }
  }
  translate(pos) {
    return {
      x: canvas.width / 2 + (pos.x - this.x),
      y: canvas.height * 2 / 3 - (pos.y - this.y)
    }
  }
}

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
  constructor(renderer, index, initPos) {
    this.renderer = renderer
    this.index = index
    this.from = this.to = (initPos || { x: 0, y: 0 })
    this.sprite = new TimeGauge(128, [0, 1])
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
    let pos = this.renderer.camera.translate(this.pos())
    renderer.drawers.drawCar(this.index, pos.x, pos.y, this.sprite.update(dt))
  }
}

export default class Renderer {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.fitToWindow()
    window.addEventListener('resize', () => this.fitToWindow())

    this.ctx = canvas.getContext('2d')
    this.drawers = {
      fillBackground: (color) => {
        this.ctx.fillStyle = color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      }

    }

    this.camera = new Camera()
    this.cars = []
  }

  fitToWindow() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  spawn(index, pos) {
    const car = new CarRO(this, index, pos)
    if (!this.camera.center) {
      this.camera.center = car
    }
    this.cars.push(car)
    return car
  }

  loadResource(path, afterLoaded) {
    const resources = document.getElementById('resources')
    const img = document.createElement('img')
    img.src = path
    img.addEventListener('load', () => afterLoaded(img))
    resources.appendChild(img)
  }

  loadResources(afterLoaded) {
    this.loadResource('images/car.png', (img) => {
      this.drawers.drawCar = (index, x, y, sprite) => {
        this.ctx.drawImage(img, r.car.w * index, sprite * r.car.h, r.car.w, r.car.h, x, y, r.car.w, r.car.h)
      }
      afterLoaded()
    })
  }

  render(dt) {
    this.drawers.fillBackground('#888888')
    this.cars.forEach(each => each.update(dt))
    this.camera.update()
    this.cars.forEach(each => each.draw(dt))
  }

  start() {
    this.loadResources(() => {
      let lastRender = 0
      const renderLoop = (timestamp) => {
        const delta = timestamp - (lastRender || timestamp)
        this.render(delta)
        lastRender = timestamp
        window.requestAnimationFrame(renderLoop)
      }
      window.requestAnimationFrame(renderLoop)
    });
  }

  demo() {
    const car = this.spawn(0, { x: 0, y: 0 })
    this.spawn(1, { x: 1, y: 0 })

    let posY = 1
    setInterval(() => {
      car.move({ x: 0, y: posY++ })
    }, 1000)
  }
}
