import { Board } from './board'
import { Car } from './car'
import * as assert from 'assert'
import * as _ from 'lodash'

type GameState = 'not_started' | 'playing' | 'over'

export class GameManager {
  // in milliseconds
  private readonly TICK_INTERVAL = 500
  // in milliseconds
  private readonly GAME_DURATION = 60e3

  private board: Board
  private _state: GameState = 'not_started'
  private startTimeMs: number
  private lastRenderTimeMs: number
  private lastTickTimeMs: number | undefined

  public constructor () {
    this.board = new Board(this)
  }

  public get state () {
    return this._state
  }

  public start () {
    if (this._state !== 'not_started') {
      throw new Error('game already started or game over')
    }
    const car1 = new Car(this.board)
    const car2 = new Car(this.board)
    assert(this.board.cars.length > 1, 'at least 2 cars needed to start the race')
    this._state = 'playing'
    this.startTimeMs = performance.now()
    this.lastRenderTimeMs = this.startTimeMs
    this.lastTickTimeMs = this.startTimeMs
    requestAnimationFrame(() => this.update)
  }

  public update (timeMs: number) {
    const elapsed = timeMs - this.startTimeMs
    const isGameOver = elapsed >= this.GAME_DURATION
    if (isGameOver) {
      this.onGameOver()
    } else {
      if (_.isNil(this.lastTickTimeMs)) {
        this.onTick()
      } else {
        const tickDiffMs = timeMs - this.lastTickTimeMs
        const tickDiff = Math.floor(tickDiffMs / this.TICK_INTERVAL)
        if (tickDiff > 0) {
          for (let i = 0; i < tickDiff; ++i) {
            this.onTick()
          }
        }
      }
    }
    const diff = timeMs - this.lastRenderTimeMs
    this.render(diff)
    this.lastRenderTimeMs = timeMs
    if (!isGameOver) {
      requestAnimationFrame(() => this.update)
    }
  }

  public render (timeMs: number) {

  }

  public onGameOver () {
    this._state = 'over'

  }

  public onTick () {
    this.lastTickTimeMs = performance.now()
  }
}
