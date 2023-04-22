const {Contact} = require("../models/contact");

const HttpError = require('../helpers');

const {controllerWrapper} = require('../utils')

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, blocked = true } = req.query;
  const skip = (page - 1) * limit;
  if (blocked) {
      const result = await Contact.find(
        { owner, blocked },
        "-createdAt -updatedAt",
        {
          skip,
          limit,
        }
      ).populate('owner', 'name email');
      res.json(result);
  }
  const result = await Contact.find({ owner }, "-createdAt, -updatedAt", { skip, limit }).populate('owner', 'name email');
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
    const { _id: owner } = req.user;
    const result = await Contact.create({...req.body, owner});
    res.status(201).json(result);
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