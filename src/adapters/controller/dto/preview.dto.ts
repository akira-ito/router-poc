import { Driver } from '../../../models/driver.model';
import { Order } from '../../../models/order.model';
import { TripContext } from '../../../models/trip.model';

export interface TripPreviewDto {
  driver: Driver;
  orders: Order[];
  context: TripContext;
}
