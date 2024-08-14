const express = require('express');
const router = express.Router();
const userControler =  require('../controllers/user');
const authenticateToken = require('../middlewares/authMiddleware');

// Spatial Users
router.post('/signup', userControler.signUp);
router.post('/login', userControler.login);

router.get('/spatial/:id', authenticateToken, userControler.getSpatialProfileById);
router.put('/spatial/:id', authenticateToken, userControler.editSpatialProfile);

router.post('/user/add', authenticateToken, userControler.addUser);

module.exports = router;