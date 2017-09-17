import { Car } from './car'

export class Board {
  private readonly HORIZONTAL_GRID_COUNT = 10
  private readonly VERTICAL_GRID_COUNT = 40

  private cars: Car[]

  public constructor () {
    this.reset()
  }

  public reset() {
    this.cars = []
  }
}

export enum GridState {
  FREE = 0,
  BLOCKED = 1,
  OUT_OF_BOUNDS = 2,
}
