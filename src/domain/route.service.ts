import { Driver } from '../models/driver.model';
import { VroomRouteResponse } from '../models/vroom-response.model';

export class RouteService {
  async considerNewTrip(drivers: Driver[], routes: VroomRouteResponse[]) {
    const result = [];
    for (const route of routes) {
      const driver = drivers[route.vehicle];
      if (driver.trips.length != route.steps.length / 2 - 1) {
        result.push(route);
      } else {
        console.log(
          'ignore',
          route.vehicle,
          driver.trips.length,
          route.steps.length,
        );
      }
    }
    return result;
  }

  async parse(routes: VroomRouteResponse[]) {
    return routes.map((route) => {
      return {
        vehicle: route.vehicle,
        cost: route.cost,
        description: route.description,
        setup: route.setup,
        service: route.service,
        duration: route.duration,
        waiting_time: route.waiting_time,
        priority: route.priority,
        steps: this.parseSteps(route.steps),
        violations: route.violations,
      };
    });
  }

  private parseSteps(steps: any[]) {
    return steps.map((step) => {
      return {
        type: step.type,
        location: step.location,
        setup: step.setup,
        service: step.service,
        waiting_time: step.waiting_time,
        arrival: step.arrival,
        duration: step.duration,
        violations: step.violations,
        id: step.id,
        job: step.job,
      };
    });
  }

  static getRouteDescription(route: VroomRouteResponse): string {
    const steps = route.steps.map((step) => {
      if (step.type === 'start') {
        return `Start at ${step.location}`;
      } else if (step.type === 'end') {
        return `End at ${step.location}`;
      } else if (step.type === 'pickup') {
        return `Pickup at ${step.location}`;
      } else if (step.type === 'delivery') {
        return `Delivery at ${step.location}`;
      }
      return '';
    });

    return steps.join(' -> ');
  }
}
