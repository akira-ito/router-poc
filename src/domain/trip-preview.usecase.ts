import { Driver } from '../models/driver.model';
import { Order } from '../models/order.model';
import { TripContext, TripOptions } from '../models/trip.model';
import { VroomResponse } from '../models/vroom-response.model';
import { VroomRequest } from '../models/vroom.model';
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
        c: true,
      },
    };

    for (const order of orders) {
      const shipmentId = vroomRequest.shipments.length;
      const shipment = await this.tripService.createOrderVroom(
        shipmentId,
        order,
      );
      vroomRequest.shipments.push(shipment);
    }

    const trips = {} as any;
    const vehicleId = vroomRequest.vehicles.length;
    const vehicle = await this.tripService.createDriverVroom(
      vehicleId,
      driver,
      context,
    );
    vroomRequest.vehicles.push(vehicle);

    const response = await this.vroomService.createTrip(vroomRequest);
    console.log('Vroom response:', response.summary);

    await this.tripService.enrichRoute(response.routes, orders, trips, [
      driver,
    ]);

    return response;
  }
}
