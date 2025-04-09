export interface Order {
  acceptedAt: string;
  createdAt: string;
  currentAssignedDriver: string | null;
  dropoffLocation: [number, number];
  lastStatus: string;
  orderId: string;
  pickupLocation: [number, number];
  readyAround: string;
  readyAt: string | null;
}
