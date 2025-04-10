import { Driver } from '../models/driver.model';
import { Order } from '../models/order.model';
import { TripContext } from '../models/trip.model';
import { Shipment, Step, Vehicle, VroomRequest } from '../models/vroom.model';
import { VroomService } from './vroom.service';

export class TripService {
  private readonly vroomService: VroomService;
  constructor() {
    this.vroomService = new VroomService(
      process.env.VROOM_URL || 'http://localhost:3000',
    );
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
        // skills: [],
        // time_window: [0, 0],
        max_tasks: context.maxTripsPerDriver * 2,
        max_travel_time: context.maxDeliveryMinutes * 60,
        steps: [],
      } as Vehicle;

      const stepPikups = [];
      const stepDeliveries = [];
      for (const trip of driver.trips) {
        const shipment = {
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

    for (const a of vroomRequest.vehicles) {
      console.log(a.steps);
    }

    const response = await this.vroomService.createTrip(vroomRequest);
    console.log('Vroom response:', response.routes[1]);
  }
}

function aa() {
  const trip = [
    {
      arrivedAtMerchant: '2025-04-05T00:25:10.367Z',
      arrivingAtMerchant: '2025-04-05T00:24:09.262Z',
      dropoffLocation: [19.386276851568756, -81.38561334460974],
      orderId: 'MAC1223085',
      pickupLocation: [19.295082343245973, -81.37986627976228],
      status: 'accepted',
    },
    {
      arrivedAtMerchant: null,
      arrivingAtMerchant: null,
      dropoffLocation: [19.385378019114825, -81.39510937035084],
      orderId: 'BMA1223198',
      pickupLocation: [19.29967290919337, -81.37606273668395],
      status: 'accepted',
    },
    {
      arrivedAtMerchant: null,
      arrivingAtMerchant: null,
      dropoffLocation: [19.39421811482212, -81.39057207852602],
      orderId: 'SSP1241330',
      pickupLocation: [19.3073221, -81.3837027],
      status: 'accepted',
    },
    {
      arrivedAtMerchant: null,
      arrivingAtMerchant: null,
      dropoffLocation: [19.389332908049195, -81.40333302319051],
      orderId: 'CNO1353816',
      pickupLocation: [19.298486, -81.382139],
      status: 'accepted',
    },
  ];

  const pickups = [];
  const dropoffs = [];
  for (const t of trip) {
    const pickup = t.pickupLocation;

    pickups.push([pickup[0], pickup[1]]);
    dropoffs.push(t.dropoffLocation);
  }
  let b = pickups.join("'/'");
  let c = dropoffs.join("'/'");
  const a = `https://www.google.es/maps/dir/'${b}'/'${c}'/`;
  console.log(a);
}
