// import 'dotenv/config';
import express from 'express';
import router from './adapters/controller/router.controller';
import config from './config/config';

import cors from 'cors';

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(cors());

app.use('/router', router);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
