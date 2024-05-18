const express = require('express');
const contacts = require('../../models/contacts.js');
const { nanoid } = require('nanoid');
const joi = require('joi');

const router = express.Router();
const addContactSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  phone: joi.string().min(9).max(15).required(),
});
const updateContactSchema = joi.object({
  name: joi.string().min(3).max(30),
  email: joi.string().email(),
  phone: joi.string().min(9).max(15),
});

function validateContact(req, res, next) {
  const { error } =
    req.method === 'POST'
      ? addContactSchema.validate(req.body)
      : updateContactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  next();
}

router.get('/', async (req, res, next) => {
  try {
    const contactList = await contacts.listContacts();

    return res.status(200).json({
      data: { contactList },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await contacts.getContactById(contactId);

    if (contact.length === 0) {
      return res.status(404).json({
        message: 'Not found',
      });
    }
    return res.status(200).json({
      data: { contact },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', validateContact, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (name === null || email === null || phone === null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const contact = {
      id: nanoid(),
      name,
      email,
      phone,
    };

    await contacts.addContact(contact);

    return res.status(201).json({
      data: { contact },
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const [contact] = await contacts.getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Not found',
      });
    }

    await contacts.removeContact(contactId);

    return res.status(200).json({ mensaje: 'Contact deleted' });
  } catch (err) {
    next(err);
  }
});

router.put('/:contactId', validateContact, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    if (!req.body) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const [contact] = await contacts.getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Not found',
      });
    }

    contact.name = name != null ? name : contact.name;
    contact.email = email != null ? email : contact.email;
    contact.phone = phone != null ? phone : contact.phone;

    await contacts.updateContact(contactId, contact);

    return res.status(200).json({
      mensaje: 'Contact updated',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
