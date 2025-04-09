export interface Trip {
  arrivedAtMerchant: Date | null;
  arrivingAtMerchant: Date | null;
  dropoffLocation: [number, number];
  orderId: string;
  pickupLocation: [number, number];
  status: string;
}

export interface Driver {
  currentLocation: [number, number];
  id: string;
  name: string;
  status: string;
  trips: Trip[];
}
