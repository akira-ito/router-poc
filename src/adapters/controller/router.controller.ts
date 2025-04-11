import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { TripService } from '../../domain/trip.service';
import { TripOptions } from '../../models/trip.model';
const router = Router();

router.post('/from-json', async (req, res) => {
  const filePath = path.join(__dirname, '../../../data/order_trips.json');

  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    try {
      const options = req.body as TripOptions;
      const orderTrip = JSON.parse(data);
      const tripService = new TripService();
      const trips = await tripService.createTrip(
        orderTrip.context,
        orderTrip.orders,
        orderTrip.drivers,
        options,
      );
      res.json(trips);
    } catch (error) {
      console.error('Error processing the file or making the API call:', error);
      res.json(error);
    }
  });
});

export default router;
