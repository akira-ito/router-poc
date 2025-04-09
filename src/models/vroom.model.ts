export interface VroomRequest {
  vehicles: Vehicle[];
  jobs: Job[];
  shipments: Shipment[];
}

export interface Vehicle {
  id: number;
  description?: string;
  start?: [number, number];
  end?: [number, number];
  capacity?: number[];
  skills?: number[];
  time_window?: [number, number];
  max_tasks?: number;
  max_distance?: number;
  max_travel_time?: number;
  breaks?: Break[];
  steps?: Step[];
}

export interface Step {
  type: 'start' | 'job' | 'pickup' | 'delivery' | 'break' | 'end';
  id?: number; // id of the task to be performed at this step if type value is job, pickup, delivery or break
  service_at?: number; // hard constraint on service time
  service_after?: number; // hard constraint on service time lower bound
  service_before?: number; // hard constraint on service time upper bound
}

export interface Break {
  id: number;
  service: number;
  time_windows: [number, number][];
}

export interface Job {
  id: number;
  service: number;
  delivery?: number[];
  pickup?: number[];
  location: [number, number];
  skills: number[];
  time_windows?: [number, number][];
}

export interface Shipment {
  amount?: number[];
  skills?: number[];
  pickup: ShipmentDetail;
  delivery: ShipmentDetail;
}

export interface ShipmentDetail {
  id: number;
  service?: number;
  location: [number, number];
}
