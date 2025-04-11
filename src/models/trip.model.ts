export interface TripContext {
  currentTime: string;
  maxDeliveryMinutes: number;
  maxTripsPerDriver: number;
}

export interface TripOptions {
  ignoreSameTripsDriver?: boolean;
}
