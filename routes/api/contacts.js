const express = require('express');
const contacts = require('../../models/contacts');
const joi = require('joi');

const router = express.Router();

const contactSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  phone: joi
    .string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
});

function validateContact(req, res, next) {
  const { error } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  next();
}

router.get('/', async (req, res, next) => {
  try {
    console.log('get method start');
    const contactList = await contacts.listContacts();

    return res.status(200).json({
      data: contactList,
      count: contactList.length,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await contacts.getContactById(contactId);

    if (contact == null) {
      return res.status(404).json({
        message: 'Not found',
      });
    }
    return res.status(200).json({
      data: contact,
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
      name,
      email,
      phone,
    };

    const contactAdded = await contacts.addContact(contact);

    return res.status(201).json({
      message: 'Contact added',
      data: contactAdded,
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await contacts.getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    await contacts.removeContact(contactId);

    return res.status(200).json({ message: 'Contact deleted' });
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

    const contact = await contacts.getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    contact.name = name != null ? name : contact.name;
    contact.email = email != null ? email : contact.email;
    contact.phone = phone != null ? phone : contact.phone;

    await contacts.updateContact(contactId, contact);

    return res.status(200).json({
      message: 'Contact updated',
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    if (!req.body) {
      return res.status(400).json({ message: 'Missing field favorite' });
    }

    const contact = await contacts.getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }
    contact.favorite = favorite;

    await contacts.updateStatusContact(contactId, contact);

    return res.status(200).json({
      message: 'Contact status updated',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
