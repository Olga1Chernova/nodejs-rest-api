const {Contact} = require("../models/contact");

const HttpError = require('../helpers');

const {controllerWrapper} = require('../utils')

const getAllContacts = async (_, res) => {
  const result = await Contact.find();
  res.json(result)
}

const getContactById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, `Contact with id ${id} wasn't found`)
    }
    res.json(result)
}

const addContact = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result)
}

const deleteContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404, `Contact with id ${id} wasn't found`)
    }
    res.json(result)
}

const updateContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
      throw HttpError(404, `Contact with id ${id} wasn't found`)
    }
    res.json(result)
}

const updateBlockedById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
      throw HttpError(404, `Contact with id ${id} wasn't found`)
    }
    res.json(result)
}

module.exports = {
  getAllContacts: controllerWrapper(getAllContacts),
  getContactById: controllerWrapper(getContactById),
  addContact: controllerWrapper(addContact),
  deleteContact: controllerWrapper(deleteContact),
  updateContact: controllerWrapper(updateContact),
  updateBlockedById:controllerWrapper(updateBlockedById),
}