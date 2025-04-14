import { Driver, Trip } from './driver.model';
import { Order } from './order.model';

export interface VroomResponse {
  code: number;
  summary: {
    cost: number;
    routes: number;
    unassigned: number;
    setup: number;
    service: number;
    duration: number;
    waiting_time: number;
    priority: number;
    violations: any[];
    computing_times: {
      loading: number;
      solving: number;
      routing: number;
    };
  };
  unassigned: any[];
  routes: VroomRouteResponse[];
}

export interface VroomRouteResponse {
  vehicle: number;
  cost: number;
  description: string;
  setup: number;
  service: number;
  duration: number;
  waiting_time: number;
  priority: number;
  steps: VroomStepResponse[];
  violations: any[];

  driver?: Driver;
}

export interface VroomStepResponse {
  type: 'start' | 'pickup' | 'delivery' | 'end';
  location: [number, number];
  setup: number;
  service: number;
  waiting_time: number;
  arrival: number;
  duration: number;
  violations: any[];
  id: number;
  job?: number;

  order?: Order;
  trip?: Trip;
}
