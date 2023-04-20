const express = require('express');

const controller = require('../../controllers/contacts-controllers');

const { validateBody } = require('../../utils');

const {schemas} = require('../../models/contact')

const router = express.Router();

router.get('/', controller.getAllContacts);

router.get('/:id', controller.getContactById);

router.post('/', validateBody(schemas.addSchema), controller.addContact);

router.delete('/:id', controller.deleteContact);

router.put('/:id', validateBody(schemas.addSchema), controller.updateContact);

router.patch('/:id', validateBody(schemas.updateBlocked), controller.updateBlockedById)

module.exports = router;
