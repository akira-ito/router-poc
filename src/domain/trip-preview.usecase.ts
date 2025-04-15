import { Driver } from '../models/driver.model';
import { Order } from '../models/order.model';
import { TripContext, TripOptions } from '../models/trip.model';
import { VroomResponse } from '../models/vroom-response.model';
import { Step, VroomRequest } from '../models/vroom.model';
import { TripService } from './trip.service';
import { VroomService } from './vroom.service';

export class TripPreviewUsecase {
  constructor(
    private readonly tripService: TripService,
    private readonly vroomService: VroomService,
  ) {}

  async createTripPreview(
    context: TripContext,
    orders: Order[],
    driver: Driver,
    opts: TripOptions = {},
  ): Promise<VroomResponse> {
    console.log(
      'Creating preview trip with context for driver:',
      context,
      orders.length,
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
      const shipment = this.tripService.createOrderVroom(shipmentId, order);
      vroomRequest.shipments.push(shipment);
    }

    const trips = {} as any;
    const vehicleId = vroomRequest.vehicles.length;
    const vehicle = this.tripService.createDriverVroom(
      vehicleId,
      driver,
      context,
      [vehicleId],
    );
    vroomRequest.vehicles.push(vehicle);

    const stepPikups = [];
    const stepDeliveries = [];
    for (const trip of driver.trips) {
      const shipmentId = vroomRequest.shipments.length;
      const shipment = this.tripService.createTripVroom(shipmentId, trip, [
        vehicleId,
      ]);
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

    console.log(trips, vroomRequest.shipments);

    vehicle.steps?.push(...stepPikups);
    vehicle.steps?.push(...stepDeliveries);

    const response = await this.vroomService.createTrip(vroomRequest);
    console.log('Vroom response:', response.summary);

    await this.tripService.enrichRoute(response.routes, orders, trips, [
      driver,
    ]);

    return response;
  }
}
