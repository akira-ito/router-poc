import config from '../config/config';
import { Driver, Trip } from '../models/driver.model';
import { Order } from '../models/order.model';
import { TripContext, TripOptions } from '../models/trip.model';
import { VroomRouteResponse } from '../models/vroom-response.model';
import { Shipment, Step, Vehicle, VroomRequest } from '../models/vroom.model';
import { RouteService } from './route.service';
import { VroomService } from './vroom.service';

export class TripService {
  private readonly vroomService: VroomService;
  constructor() {
    this.vroomService = new VroomService(config.vroomUrl);
  }
  async createTrip(
    context: TripContext,
    orders: Order[],
    drivers: Driver[],
    opts: TripOptions = {},
  ) {
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

    for (const order of orders) {
      const shipmentId = vroomRequest.shipments.length;
      const shipment = this.createOrderVroom(shipmentId, order);
      vroomRequest.shipments.push(shipment);
    }

    const trips = {} as any;
    for (const driver of drivers) {
      const vehicleId = vroomRequest.vehicles.length;
      const vehicle = this.createDriverVroom(vehicleId, driver, context, [
        vehicleId,
      ]);

      const stepPikups = [];
      const stepDeliveries = [];
      for (const trip of driver.trips) {
        const shipmentId = vroomRequest.shipments.length;
        const shipment = this.createTripVroom(shipmentId, trip, [vehicleId]);
        vroomRequest.shipments.push(shipment);
        trips[shipmentId] = trip;

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
    }

    // for (const a of vroomRequest.vehicles) {
    //   console.log(a.steps);
    // }

    const response = await this.vroomService.createTrip(vroomRequest);
    console.log('Vroom response:', response.summary);

    const routeService = new RouteService();
    if (opts.ignoreSameTripsDriver) {
      const newRoutes = await routeService.considerNewTrip(
        drivers,
        response.routes,
      );
      console.log(
        'diff',
        response.routes.length,
        newRoutes.length,
        newRoutes.map((r) => ({
          vehicle: r.vehicle,
          hasTrips: drivers[r.vehicle].trips.length,
          newTrips: r.steps.length / 2 - 1,
          orders: r.steps
            .filter(
              (step) => step.type === 'pickup' || step.type === 'delivery',
            )
            .map((step) => ({ order: orders[step.id], step }))
            .map(({ order, step }: any) =>
              order ? `${step.type}: ${order.orderId}` : null,
            ),
        })),
      );

      response.routes = newRoutes;
    }
    await this.enrichRoute(response.routes, orders, trips, drivers);
    return response;
  }

  async enrichRoute(
    routes: VroomRouteResponse[],
    orders: Order[],
    trips: any,
    drivers: Driver[],
  ) {
    for (const route of routes) {
      route.driver = drivers[route.vehicle];

      for (const step of route.steps) {
        let order = {} as any;
        let trip = {} as any;
        if (step.type === 'pickup' || step.type === 'delivery') {
          order = orders[step.id] || {};
          trip = trips[step.id] || {};
        }
        step.order = order;
        step.trip = trip;
      }
    }
  }

  createOrderVroom(shipmentId: number, order: Order) {
    return {
      // amount: [order.amount],
      // skills: order.skills,
      pickup: {
        id: shipmentId,
        location: [order.pickupLocation[1], order.pickupLocation[0]],
      },
      delivery: {
        id: shipmentId,
        location: [order.dropoffLocation[1], order.dropoffLocation[0]],
      },
    } as Shipment;
  }

  createDriverVroom(
    vehicleId: number,
    driver: Driver,
    context: TripContext,
    skills: number[] = [],
  ) {
    return {
      id: vehicleId,
      description: `${driver.name} - ${driver.id} - ${vehicleId}`,
      // profile: 'driving-car',
      start: [driver.currentLocation[1], driver.currentLocation[0]],
      // capacity: [1],
      skills,
      // time_window: [0, 0],
      max_tasks: context.maxTripsPerDriver * 2,
      max_travel_time: context.maxDeliveryMinutes * 60,
      steps: [],
    } as Vehicle;
  }

  createTripVroom(shipmentId: number, trip: Trip, skills: number[]) {
    return {
      skills,
      pickup: {
        id: shipmentId,
        location: [trip.pickupLocation[1], trip.pickupLocation[0]],
      },
      delivery: {
        id: shipmentId,
        location: [trip.dropoffLocation[1], trip.dropoffLocation[0]],
      },
    } as Shipment;
  }
}
