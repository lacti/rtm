import { Board, GridState } from './board'

export interface AdjacentGridsObserved {
  front: GridState,
  left: GridState,
  right: GridState,
}

export class Car {
  private readonly board: Board

  public constructor (board: Board) {
    this.board = board
    this.board.cars.push(this)
  }
}