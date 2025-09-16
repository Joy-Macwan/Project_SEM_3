const express = require('express');
const router = express.Router();

// Import repair center routes
const authRoutes = require('./repairCenter/auth.routes');
const repairRequestsRoutes = require('./repairCenter/repairRequests.routes');
const quoteRoutes = require('./repairCenter/quotes.routes');
const technicianRoutes = require('./repairCenter/technicians.routes');
const partsRoutes = require('./repairCenter/parts.routes');
const appointmentsRoutes = require('./repairCenter/appointments.routes');
const invoicesRoutes = require('./repairCenter/invoices.routes');
const payoutsRoutes = require('./repairCenter/payouts.routes');

// Map routes to their respective paths
router.use('/auth', authRoutes);
router.use('/repair-requests', repairRequestsRoutes);
router.use('/quotes', quoteRoutes);
router.use('/technicians', technicianRoutes);
router.use('/parts', partsRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/invoices', invoicesRoutes);
router.use('/payouts', payoutsRoutes);

// Export the router
module.exports = router;