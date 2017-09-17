import { Board, GridState } from './board'

export interface AdjacentGridsObserved {
  front: GridState,
  left: GridState,
  right: GridState,
}

export class Car {
  private readonly board: Board
  private x: number
  private y: number

  public constructor (board: Board) {
    this.board = board
    const pos = this.board.addCar(this)
    this.x = pos.x
    this.y = pos.y
  }

  public observe (): AdjacentGridsObserved {
    let front: GridState = 'free'
    const frontPos = {x: this.x, y: this.y + 1}
    if (this.board.checkIfOutOfBounds(frontPos)) {
      front = 'out_of_bounds'
    } else if (this.board.checkIfBlocked(frontPos)) {
      front = 'blocked'
    }
    let left: GridState = 'free'
    const leftPos = {x: this.x - 1, y: this.y}
    if (this.board.checkIfOutOfBounds(leftPos)) {
      front = 'out_of_bounds'
    } else if (this.board.checkIfBlocked(leftPos)) {
      front = 'blocked'
    }
    let right: GridState = 'free'
    const rightPos = {x: this.x + 1, y: this.y}
    if (this.board.checkIfOutOfBounds(rightPos)) {
      right = 'out_of_bounds'
    } else if (this.board.checkIfBlocked(rightPos)) {
      right = 'blocked'
    }
    return {
      front: front,
      left: left,
      right: right
    }
  }

  public tryMoveLeft (): boolean {
    const leftPos = {x: this.x - 1, y: this.y}
    if (this.board.checkIfOutOfBounds(leftPos) || this.board.checkIfBlocked(leftPos)) {
      return false
    } else {
      this.board.grids[leftPos.x][leftPos.y] = this
      this.board.grids[this.x][this.y] = undefined
      --this.x
      return true
    }
  }

  public tryMoveRight (): boolean {
    const rightPos = {x: this.x + 1, y: this.y}
    if (this.board.checkIfOutOfBounds(rightPos) || this.board.checkIfBlocked(rightPos)) {
      return false
    } else {
      this.board.grids[rightPos.x][rightPos.y] = this
      this.board.grids[this.x][this.y] = undefined
      ++this.x
      return true
    }
  }

  public tryMoveForward (): boolean {
    const frontPos = {x: this.x, y: this.y+1}
    if (this.board.checkIfOutOfBounds(frontPos) || this.board.checkIfBlocked(frontPos)) {
      return false
    } else {
      this.board.grids[frontPos.x][frontPos.y] = this
      this.board.grids[this.x][this.y] = undefined
      ++this.y
      return true
    }
  }
}