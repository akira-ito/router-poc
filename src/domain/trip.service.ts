import config from '../config/config';
import { Driver } from '../models/driver.model';
import { Order } from '../models/order.model';
import { TripContext } from '../models/trip.model';
import { Shipment, Step, Vehicle, VroomRequest } from '../models/vroom.model';
import { MapService } from './map.service';
import { VroomService } from './vroom.service';

export class TripService {
  private readonly vroomService: VroomService;
  constructor() {
    this.vroomService = new VroomService(config.vroomUrl);
  }
  async createTrip(context: TripContext, orders: Order[], drivers: Driver[]) {
    console.log(
      'Creating trip with context:',
      context,
      orders.length,
      drivers.length,
    );

    const vroomRequest: VroomRequest = {
      vehicles: [],
      jobs: [],
      shipments: [],
      options: {
        g: true,
        c: false,
      },
    };

    let orderCount = -1;
    for (const order of orders) {
      const shipment = {
        // amount: [order.amount],
        // skills: order.skills,
        pickup: {
          id: ++orderCount,
          //   service: order.service,
          location: [order.pickupLocation[1], order.pickupLocation[0]],
        },
        delivery: {
          id: ++orderCount,
          //   service: order.service,
          location: [order.dropoffLocation[1], order.dropoffLocation[0]],
        },
      } as Shipment;
      vroomRequest.shipments.push(shipment);
    }
    let driverCount = 0;
    for (const driver of drivers) {
      const vehicle = {
        id: driverCount,
        description: `${driver.name} - ${driver.id} - ${driverCount}`,
        // profile: 'driving-car',
        start: [driver.currentLocation[1], driver.currentLocation[0]],
        // capacity: [1],
        skills: [driverCount],
        // time_window: [0, 0],
        max_tasks: context.maxTripsPerDriver * 2,
        max_travel_time: context.maxDeliveryMinutes * 60,
        steps: [],
      } as Vehicle;

      const stepPikups = [];
      const stepDeliveries = [];
      for (const trip of driver.trips) {
        const shipment = {
          skills: [driverCount],
          pickup: {
            id: Number(`9010${driverCount}010${++orderCount}`),
            location: [trip.pickupLocation[1], trip.pickupLocation[0]],
          },
          delivery: {
            id: Number(`9010${driverCount}010${++orderCount}`),
            location: [trip.dropoffLocation[1], trip.dropoffLocation[0]],
          },
        } as Shipment;
        vroomRequest.shipments.push(shipment);

        const stepPickup = {
          type: 'pickup',
          id: shipment.pickup.id,
        } as Step;
        stepPikups.push(stepPickup);
        const stepDelivery = {
          type: 'delivery',
          id: shipment.delivery.id,
        } as Step;
        stepDeliveries.push(stepDelivery);
      }
      vehicle.steps?.push(...stepPikups);
      vehicle.steps?.push(...stepDeliveries);

      vroomRequest.vehicles.push(vehicle);
      driverCount++;
    }

    // for (const a of vroomRequest.vehicles) {
    //   console.log(a.steps);
    // }

    const response = await this.vroomService.createTrip(vroomRequest);
    console.log('Vroom response:', response.summary, response.routes[1]);

    // const routes = await new RouteService().parse(response.routes);
    const mapService = new MapService();
    for (const route of response.routes) {
      const res = await mapService.fromSteps(route.steps);
      console.log('Map response:', res);
    }
  }
}
