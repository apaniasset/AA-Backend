import { Router } from 'express';
import { AuthController as Auth } from '../controllers/admin/AuthController.js';
import { AdminController as Admin } from '../controllers/admin/AdminController.js';
import { LocationController as Location } from '../controllers/admin/LocationController.js';
import { SiteSettingsController as SiteSettings } from '../controllers/admin/SiteSettingsController.js';
import { BrandingController as Branding } from '../controllers/admin/BrandingController.js';
import { CommissionSettingsController as CommissionSettings } from '../controllers/admin/CommissionSettingsController.js';
import { UserFieldsController as UserFields } from '../controllers/admin/UserFieldsController.js';
import { CustomFieldsController as CustomFields } from '../controllers/admin/CustomFieldsController.js';

const router = Router();

// Laravel-style Group Helper
const addGroupHelper = (r) => {
    r.group = function (prefix, callback) {
        const subRouter = Router();
        addGroupHelper(subRouter);
        callback(subRouter);
        r.use(prefix, subRouter);
    };
};
addGroupHelper(router);

// --- Admin Auth ---
router.post('/login', Auth.login);
router.post('/logout', Auth.logout);
router.post('/forgot-password', Auth.forgotPassword);
router.post('/reset-password', Auth.resetPassword);

// --- Admin/Staff Management ---
router.group('/users', (group) => {
    group.post('/list', Admin.index);
    group.post('/create', Admin.store);
    group.post('/show', Admin.show);
    group.post('/update', Admin.update);
    group.post('/delete', Admin.destroy);
    group.post('/reset-password', Admin.resetPassword);
    group.post('/update-status', Admin.updateStatus);
    group.post('/change-password', Admin.changePassword);
});

// --- Location Management ---
router.group('/countries', (group) => {
    group.post('/list', Location.listCountries);
    group.post('/create', Location.addCountry);
    group.post('/update', Location.updateCountry);
    group.post('/delete', Location.deleteCountry);
});

router.group('/states', (group) => {
    group.post('/list', Location.listStates);
    group.post('/create', Location.addState);
    group.post('/update', Location.updateState);
    group.post('/delete', Location.deleteState);
});

router.group('/cities', (group) => {
    group.post('/list', Location.listCities);
    group.post('/create', Location.addCity);
    group.post('/update', Location.updateCity);
    group.post('/delete', Location.deleteCity);
});

router.group('/areas', (group) => {
    group.post('/list', Location.listAreas);
    group.post('/create', Location.addArea);
    group.post('/update', Location.updateArea);
    group.post('/delete', Location.deleteArea);
});

// --- Settings ---
router.group('/settings', (settings) => {
    // Site
    settings.group('/site', (group) => {
        group.post('/list', SiteSettings.index);
        group.post('/create', SiteSettings.store);
        group.post('/show', SiteSettings.show);
        group.post('/update', SiteSettings.update);
        group.post('/delete', SiteSettings.destroy);
    });

    // Branding
    settings.group('/branding', (group) => {
        group.post('/list', Branding.index);
        group.post('/update', Branding.update);
    });

    // Commission
    settings.group('/commission', (group) => {
        group.post('/list', CommissionSettings.index);
        group.post('/update', CommissionSettings.update);
    });

    // User Fields
    settings.group('/user-fields', (group) => {
        group.post('/list', UserFields.index);
        group.post('/update', UserFields.update);
    });

    // Custom Fields
    settings.group('/custom-fields', (group) => {
        group.post('/list', CustomFields.index);
        group.post('/create', CustomFields.store);
        group.post('/show', CustomFields.show);
        group.post('/update', CustomFields.update);
        group.post('/delete', CustomFields.destroy);
    });
});

export default router;
