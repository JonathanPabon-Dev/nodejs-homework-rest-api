const contactSchema = require('../schemas/contact.schema');

const listContacts = async () => {
  try {
    return await contactSchema.find().exec();
  } catch (err) {
    console.error(err, 'An error happened! (list contacts)');
    throw err;
  }
};

const getContactById = async contactId => {
  try {
    return await contactSchema.findById(contactId).exec();
  } catch (err) {
    console.error(err, 'An error happened! (get contact by id)');
    throw err;
  }
};

const removeContact = async contactId => {
  try {
    await contactSchema.findByIdAndDelete(contactId);
  } catch (err) {
    console.error(err, 'An error happened! (remove contact)');
    throw err;
  }
};

const addContact = async body => {
  try {
    return await contactSchema.create({ ...body, favorite: false });
  } catch (err) {
    console.error(err, 'An error happened! (add contact)');
    throw err;
  }
};

const updateContact = async (contactId, body) => {
  try {
    return await contactSchema.findByIdAndUpdate(contactId, body).exec();
  } catch (err) {
    console.error(err, 'An error happened! (update contact)');
    throw err;
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    return await contactSchema.findByIdAndUpdate(contactId, body).exec();
  } catch (err) {
    console.error(err, 'An error happened! (update favorite status)');
    throw err;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
