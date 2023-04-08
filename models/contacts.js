const fs = require('fs/promises');
const path = require('path');
const {nanoid} = require('nanoid');

const contactsPath = path.resolve("models", "contacts.json");

async function listContacts () {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
}

async function getContactById(contactId) {
    const allContacts = await listContacts();
    const result = allContacts.find(item => item.id === contactId);
    return result || null;
}

async function removeContact(contactId) {
    const allContacts = await listContacts();
    const contactIdx = allContacts.findIndex(item => item.id === contactId);
    if (contactIdx === -1) {
        return null;
    }
    const [result] = allContacts.splice(contactIdx, 1);
    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return result;
}

async function addContact({name, email, phone}) {
    const allContacts = await listContacts();

    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    }

    allContacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return newContact;
}

const updateContact = async (contactId, data) => {
  const allContacts = await listContacts();
  const idx = allContacts.find(item => item.id === contactId);
  if (idx === -1) {
    return null;
  }
  allContacts[idx] = { contactId, ...data }
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return allContacts[idx];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
