const contactSchema = require('../schemas/contact.schema');

const listContacts = async () => {
  try {
    const contacts = await contactSchema.find().exec();
    return contacts;
  } catch (err) {
    console.error(err, 'An error happened! (list contacts)');
    throw err;
  }
};

const getContactById = async contactId => {
  try {
    const contact = await contactSchema.findById(contactId).exec();

    return contact;
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
    const newContact = await contactSchema.create({ ...body, favorite: false });
    return { newContact, status: 200 };
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
