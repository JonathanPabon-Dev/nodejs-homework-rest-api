const fs = require('fs/promises');
const path = require('node:path');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);

    return contacts;
  } catch (err) {
    console.error(err, 'An error happened!');
    throw err;
  }
};

const getContactById = async contactId => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const contact = contacts.filter(contact => contact.id === contactId);

    return contact;
  } catch (err) {
    console.error(err, 'An error happened!');
    throw err;
  }
};

const removeContact = async contactId => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const newContacts = contacts.filter(contact => contact.id !== contactId);

    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
  } catch (err) {
    console.error(err, 'An error happened!');
    throw err;
  }
};

const addContact = async body => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    contacts.push(body);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (err) {
    console.error(err, 'An error happened!');
    throw err;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const contact = contacts.find(contact => contact.id === contactId);

    contact.name = body.name != null ? body.name : contact.name;
    contact.email = body.email != null ? body.email : contact.email;
    contact.phone = body.phone != null ? body.phone : contact.phone;

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (err) {
    console.error(err, 'An error happened!');
    throw err;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
