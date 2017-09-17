import { Board } from './board'

export class GameManager {
  // in milliseconds
  private readonly TICK_INTERVAL = 3000

  private board: Board

  public constructor () {
    this.reset()
  }

  public reset () {
    this.board = new Board()
  }
}
