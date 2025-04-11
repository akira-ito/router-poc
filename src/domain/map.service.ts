import { VroomStepResponse } from '../models/vroom-response.model';

export class MapService {
  async aa(orders: any[]) {
    const pickups = [];
    const dropoffs = [];
    for (const order of orders) {
      const pickup = order.pickupLocation;

      pickups.push([pickup[0], pickup[1]]);
      dropoffs.push(order.dropoffLocation);
    }
    let b = pickups.join("'/'");
    let c = dropoffs.join("'/'");
    const a = `https://www.google.es/maps/dir/'${b}'/'${c}'/`;
    return a;
  }

  async fromSteps(steps: VroomStepResponse[]) {
    const pickups = [];
    for (const step of steps) {
      if (step.type === 'pickup' || step.type === 'delivery') {
        pickups.push([step.location[1], step.location[0]]);
      }
    }
    let b = pickups.join("'/'");
    const a = `https://www.google.es/maps/dir/'${b}'/`;
    return a;
  }
}
