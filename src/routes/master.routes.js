import { Router } from 'express';
import * as Master from '../controllers/master.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const auth = authMiddleware(['superadmin', 'admin']); // Only admins can manage masters

// Countries
router.get('/countries', Master.getCountries);
router.post('/countries', auth, Master.createCountry);
router.put('/countries/:id', auth, Master.updateCountry);
router.delete('/countries/:id', auth, Master.deleteCountry);

// States
router.get('/states', Master.getStates);
router.get('/states/country/:countryId', Master.getStatesByCountry);
router.post('/states', auth, Master.createState);
router.put('/states/:id', auth, Master.updateState);
router.delete('/states/:id', auth, Master.deleteState);

// Cities
router.get('/cities', Master.getCities);
router.get('/cities/state/:stateId', Master.getCitiesByState);
router.post('/cities', auth, Master.createCity);
router.put('/cities/:id', auth, Master.updateCity);
router.delete('/cities/:id', auth, Master.deleteCity);

// Locations
router.get('/locations', Master.getLocations);
router.get('/locations/city/:cityId', Master.getLocationsByCity);
router.post('/locations', auth, Master.createLocation);
router.put('/locations/:id', auth, Master.updateLocation);
router.delete('/locations/:id', auth, Master.deleteLocation);

export default router;
