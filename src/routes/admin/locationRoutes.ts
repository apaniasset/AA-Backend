import { Router } from 'express';
import { LocationController } from '../../controllers/admin/LocationController.js';

const router = Router();

// Countries
router.get('/countries', LocationController.listCountries);
router.post('/countries', LocationController.addCountry);
router.put('/countries/:id', LocationController.updateCountry);
router.delete('/countries/:id', LocationController.deleteCountry);

// States
router.get('/states', LocationController.listStates);
router.post('/states', LocationController.addState);
router.put('/states/:id', LocationController.updateState);
router.delete('/states/:id', LocationController.deleteState);

// Cities
router.get('/cities', LocationController.listCities);
router.post('/cities', LocationController.addCity);
router.put('/cities/:id', LocationController.updateCity);
router.delete('/cities/:id', LocationController.deleteCity);

// Areas
router.get('/areas', LocationController.listAreas);
router.post('/areas', LocationController.addArea);
router.put('/areas/:id', LocationController.updateArea);
router.delete('/areas/:id', LocationController.deleteArea);

export default router;
