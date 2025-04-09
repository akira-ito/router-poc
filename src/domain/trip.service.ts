import { Driver } from '../models/driver.model';
import { Order } from '../models/order.model';
import { TripContext } from '../models/trip.model';
import { Shipment, Vehicle, VroomRequest } from '../models/vroom.model';
import { VroomService } from './vroom.service';

export class TripService {
  private readonly vroomService: VroomService;
  constructor() {
    this.vroomService = new VroomService(
      process.env.VROOM_URL || 'http://localhost:3000',
    );
  }
  async createTrip(context: TripContext, orders: Order[], drivers: Driver[]) {
    const vroomRequest: VroomRequest = {
      vehicles: [],
      jobs: [],
      shipments: [],
    };

    let orderCount = 0;
    for (const order of orders) {
      const shipment = {
        // amount: [order.amount],
        // skills: order.skills,
        pickup: {
          id: orderCount,
          //   service: order.service,
          location: order.pickupLocation,
        },
        delivery: {
          id: orderCount,
          //   service: order.service,
          location: order.dropoffLocation,
        },
      } as Shipment;
      vroomRequest.shipments.push(shipment);
      orderCount++;
    }
    let driverCount = 0;
    for (const driver of drivers) {
      const vehicle = {
        id: driverCount,
        description: `${driver.name} - ${driver.id}`,
        // profile: 'driving-car',
        start: driver.currentLocation,
        // capacity: [1],
        // skills: [],
        // time_window: [0, 0],
        max_tasks: context.maxTripsPerDriver,
        max_travel_time: context.maxDeliveryMinutes * 60,
      } as Vehicle;
      vroomRequest.vehicles.push(vehicle);
      driverCount++;
    }
    await this.vroomService.createTrip(vroomRequest);
  }
}
