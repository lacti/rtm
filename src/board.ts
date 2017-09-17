import { Car } from './car'

export class Board {
  private readonly HORIZONTAL_GRID_COUNT = 10
  private readonly VERTICAL_GRID_COUNT = 40

  public readonly cars: Car[] = []

  public constructor () {
  }
}

export type GridState = 'free' | 'blocked' | 'out_of_bounds'
