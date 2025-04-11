import { Router } from 'express';

const router = Router();

function x() {
  console.log('hello');
}
router.get('/', async (req, res) => {
  res.render('pages/map', {
    title: 'Map',
    description: 'Map page',
    process: x,
  });
});

export default router;
