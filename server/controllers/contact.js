const { validationResult } = require("express-validator/check");
const ContactModel = require("../models/contactModel");
const UserModel = require("../models/userModel");
const { transSuccess, transErrors } = require("../../lang/vi");
const { contact } = require("../services/index");

let getContacts = async (req, res, next) => {
  try {
    let currentUserId = req.user._id;

    // Contact
    const contacts = await contact.getContacts(currentUserId);
    const requests = await contact.getContactsReceived(currentUserId);
    const requestsSent = await contact.getContactsSent(currentUserId);

    // Count
    const countContact = await contact.countAllContacts(currentUserId);
    const countSent = await contact.countAllContactsSent(currentUserId);
    const countReceived = await contact.countAllContactsReceived(currentUserId);

    return res.status(200).json({
      contacts,
      requests,
      requestsSent,
      countContact,
      countReceived,
      countSent,
    });
  } catch (error) {
    return next(error);
  }
};

let findUsersContact = async (req, res) => {
  let errorArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorArr.push(item.msg);
    });
    return res.status(500).send(errorArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;
    let users = await contact.findUsersContact(currentUserId, keyword);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let createContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;

    let contactId = req.body._id;
    let userContact;

    let newContact = await contact.addNew(currentUserId, contactId);
    if (newContact) {
      userContact = await UserModel.getNormalUserDataById(contactId);
    }
    const data = {
      newContact,
      userContact,
    };

    return res.status(200).json(data); // return true or false with !!newContact
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequestContactSent = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.params.id;

    await contact.removeRequestContactSent(currentUserId, contactId);
    return res.status(200).send({ contactId }); // return true or false with !!newContact
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequest = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.params.id;

    let removeReq = await contact.removeRequestContactReceived(
      currentUserId,
      contactId
    );
    return res.status(200).send({ contactId }); // return true or false with !!newContact
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.params.id;

    let removeContact = await contact.removeContact(currentUserId, contactId);
    return res.status(200).send({ success: !!removeContact }); // return true or false with !!newContact
  } catch (error) {
    return res.status(500).send(error);
  }
};

let accept = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.params.id;

    let acceptReq = await contact.acceptRequestContactReceived(
      currentUserId,
      contactId
    );

    let userContact = await UserModel.getNormalUserDataById(contactId);

    return res.status(200).json(userContact); // return true or false with !!newContact
  } catch (error) {
    return res.status(500).send(error);
  }
};

let block = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.params.id;

    let userContact = await ContactModel.blockByUserId(contactId);

    return res.status(200).json(userContact); // return true or false with !!newContact
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  getContacts,
  findUsersContact,
  createContact,
  removeRequestContactSent,
  removeRequest,
  removeContact,
  accept,
  block,
};
