import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.middleware';
import * as controller from './settings.controller';

const router = Router();
router.use(authenticate);

// Company (admin-only writes)
router.get('/company', controller.getCompany);
router.put('/company', requireRole('admin'), controller.updateCompany);

// Roles & permissions (admin-only)
router.get('/roles', controller.getRoles);
router.put('/roles/:role/permissions', requireRole('admin'), controller.updateRolePermission);

// User access (admin-only)
router.get('/users', controller.listUsers);
router.patch('/users/:employeeId/role', requireRole('admin'), controller.setUserRole);
router.patch('/users/:employeeId/access', requireRole('admin'), controller.toggleUserAccess);

// Preferences (self-service)
router.get('/preferences', controller.getPreferences);
router.put('/preferences', controller.updatePreferences);

export default router;
