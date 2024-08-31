const express = require('express');
const router = express.Router();
const userControler =  require('../controllers/user');
const authenticateToken = require('../middlewares/authMiddleware');

// Spatial Users
router.post('/send-otp', userControler.sendOtpToUser);
router.post('/login', userControler.loginUser);

router.get('/spatial/:id', authenticateToken, userControler.getSpatialProfileById);
router.put('/spatial/:id', authenticateToken, userControler.editSpatialProfile);

router.post('/user/add', authenticateToken, userControler.addUser);
router.get('/user/subadmin/:adminId', authenticateToken, userControler.getSubAdminUsers);
router.get('/user/:adminId', authenticateToken, userControler.getRegularUsers);
router.get('/admin/:userId', authenticateToken, userControler.getMyAdmin);
router.get('/admin/:adminId/:userId', authenticateToken, userControler.getMyAdmin);
router.delete('/admin/:adminId/user/:userId', authenticateToken, userControler.removeUserFromCommunity);

router.post('/message/:adminId', authenticateToken, userControler.addMessageToSpatialUser);
router.get('/message/:adminId', authenticateToken, userControler.getMessages);


module.exports = router;