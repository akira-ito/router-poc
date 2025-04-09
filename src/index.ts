import fs from 'fs';
import path from 'path';
import { TripService } from './domain/trip.service';

const filePath = path.join(__dirname, '../data/order_trips.json');

// Read the ordertrip.json file
fs.readFile(filePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    const orderTrip = JSON.parse(data);
    new TripService().createTrip(
      orderTrip.context,
      orderTrip.orders,
      orderTrip.drivers,
    );
  } catch (error) {
    console.error('Error processing the file or making the API call:', error);
  }
});
