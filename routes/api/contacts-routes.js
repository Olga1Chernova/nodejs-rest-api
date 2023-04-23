const express = require('express');

const controller = require('../../controllers/contacts-controllers');

const { validateBody } = require('../../utils');

const { schemas } = require('../../models/contact')

const { isValidId, authenticate } = require('../../middlewares');

const router = express.Router();

router.get('/', authenticate, controller.getAllContacts);

router.get('/:id', authenticate, isValidId, controller.getContactById);

router.post('/', authenticate, validateBody(schemas.addSchema), controller.addContact);

router.delete('/:id', authenticate, isValidId, controller.deleteContact);

router.put('/:id', authenticate, isValidId, validateBody(schemas.addSchema), controller.updateContact);

router.patch('/:id', authenticate, isValidId, validateBody(schemas.updateBlocked), controller.updateBlockedById)

module.exports = router;
