import { Router } from 'express';
import statusRoutes from './status.js';
import roleRoutes from './role.js';
import permissionRoutes from './permission.js';
import listingTypeRoutes from './listing-type.js';
import propertyTypeRoutes from './property-type.js';
import bhkTypeRoutes from './bhk-type.js';
import furnishingStatusRoutes from './furnishing-status.js';
import facingDirectionRoutes from './facing-direction.js';
import constructionStatusRoutes from './construction-status.js';
import packageRoutes from './package.js';
import countryRoutes from './country.js';
import stateRoutes from './state.js';
import cityRoutes from './city.js';
import localityRoutes from './locality.js';
import subLocalityRoutes from './sub-locality.js';

const router = Router();

router.use('/statuses', statusRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/listing-types', listingTypeRoutes);
router.use('/property-types', propertyTypeRoutes);
router.use('/bhk-types', bhkTypeRoutes);
router.use('/furnishing-statuses', furnishingStatusRoutes);
router.use('/facing-directions', facingDirectionRoutes);
router.use('/construction-statuses', constructionStatusRoutes);
router.use('/packages', packageRoutes);
router.use('/countries', countryRoutes);
router.use('/states', stateRoutes);
router.use('/cities', cityRoutes);
router.use('/localities', localityRoutes);
router.use('/sub-localities', subLocalityRoutes);

export default router;
