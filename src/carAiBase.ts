import { Car } from './car'

export abstract class CarAiBase {
  private readonly attachedCar: Car

  public constructor(carToAttachAi: Car) {
    this.attachedCar = carToAttachAi
  }

  public abstract onTick(): void
}