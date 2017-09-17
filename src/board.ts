import { Car } from './car'
import { GameManager } from './gameManager'
import * as _ from 'lodash'
import * as assert from 'assert'

export class Board {
  private readonly HORIZONTAL_GRID_COUNT = 10
  private readonly VERTICAL_GRID_COUNT = 50000

  private readonly gameManager: GameManager

  public readonly cars: Car[] = []
  public readonly grids: (Car | undefined)[][]

  public constructor (gameManager: GameManager) {
    this.gameManager = gameManager
    for (let x = 0; x < this.HORIZONTAL_GRID_COUNT; ++x) {
      this.grids[x] = []
    }
  }

  public addCar (car: Car) {
    if (!this.canAddCar()) {
      throw new Error('cannot add more car')
    }
    const freePosX = _.sample(this.getFreeBottomGridPositions())!
    assert.notEqual(freePosX, null)
    this.grids[freePosX][0] = car
  }

  public canAddCar (): boolean {
    if (this.gameManager.state === 'over') {
      return false
    }
    const freePosX = this.getFreeBottomGridPositions()
    return !_.isEmpty(freePosX)
  }

  public getFreeBottomGridPositions (): number[] {
    const freeGrids: number[] = []
    for (let x = 0; x < this.HORIZONTAL_GRID_COUNT; ++x) {
      if (_.isNil(this.grids[x][0])) {
        freeGrids.push(x)
      }
    }
    return freeGrids
  }

  public getCarsAtTheEnd(): Car[] {
    const carsAtTheEnd: Car[] = []
    for (let x=0; x<this.HORIZONTAL_GRID_COUNT; ++x) {
      if (!_.isNil(this.grids[x][this.VERTICAL_GRID_COUNT-1])) {
        carsAtTheEnd.push(this.grids[x][this.VERTICAL_GRID_COUNT-1] as Car)
      }
    }
    return carsAtTheEnd
  }
}

export type GridState = 'free' | 'blocked' | 'out_of_bounds'
