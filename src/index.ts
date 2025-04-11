// import 'dotenv/config';
import express from 'express';
import router from './adapters/controller/router.controller';
import config from './config/config';

// const filePath = path.join(__dirname, '../data/order_trips.json');

// // Read the ordertrip.json file
// fs.readFile(filePath, 'utf8', async (err, data) => {
//   if (err) {
//     console.error('Error reading the file:', err);
//     return;
//   }

//   try {
//     const orderTrip = JSON.parse(data);
//     new TripService().createTrip(
//       orderTrip.context,
//       orderTrip.orders,
//       orderTrip.drivers,
//     );
//   } catch (error) {
//     console.error('Error processing the file or making the API call:', error);
//   }
// });

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', router);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
