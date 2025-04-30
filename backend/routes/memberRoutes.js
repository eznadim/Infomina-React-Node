const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', memberController.getAllMembers);

router.get('/search', memberController.searchMembers);

router.get('/filter', memberController.filterMembers);

router.get('/stats', memberController.getMemberStats);

router.get('/:id', memberController.getMemberById);

router.post('/', memberController.createMember);

router.put('/:id', memberController.updateMember);

router.delete('/:id', memberController.deleteMember);

module.exports = router;