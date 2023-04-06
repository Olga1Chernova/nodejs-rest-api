const express = require('express');

const contacts = require('../../models/contacts');

const HttpError = require('../../helpers');

const joi = require('joi');

const router = express.Router()

const addSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": `"name" is required`,
    "string.empty":`"name" field can't be empty!`
  }),
  phone: joi.string().required().messages({
    "any.required": `"phone" is required`,
    "string.empty":`"phone" field can't be empty!`
  }),
  email: joi.string().required().messages({
    "any.required": `"email" is required`,
    "string.empty":`"email" field can't be empty!`
  }),
})

router.get('/', async (_, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with id ${id} wasn't found`)
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message)
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact with id ${id} wasn't found`)
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await contacts.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with id ${id} wasn't found`)
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = router;
