const ContactModel = require("./../models/contactModel");
const UserModel = require("./../models/userModel");
const NotificationModel = require("./../models/notificationModel");
const _ = require("lodash");

const LIMIT_NUMBER_TAKEN = 10;

let findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [currentUserId]; // loai bo nhung thang da la ban be r ke ca chinh minh`
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);
    contactsByUser.forEach((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });
    deprecatedUserIds = _.uniqBy(deprecatedUserIds); //Loai bo nhung thang trung lap oK
    let users = await UserModel.findAllForAddContact(
      deprecatedUserIds,
      keyword,
    );
    resolve(users);
  });
};

let searchFriend = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let friendId = [];
    let friends = await ContactModel.getFriend(currentUserId);
    friends.forEach((item) => {
      friendId.push(item.userId);
      friendId.push(item.contactId);
    });

    friendId = _.unionBy(friendId); //Loai bo nhung thang trung lap oK
    friendId = friendId.filter((userId) => userId != currentUserId); // loai bo chinh no

    let users = await UserModel.findAllToAddGroup(friendId, keyword);

    resolve(users);
  });
};

let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExist = await ContactModel.checkContactExists(
      currentUserId,
      contactId,
    );
    if (contactExist) {
      return reject(false);
    }
    // Create Contact
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId,
    };
    let newContact = await ContactModel.createNew(newContactItem);

    // Create Notification
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.types.ADD_CONTACT,
    };

    await NotificationModel.model.createNew(notificationItem);

    resolve(newContact);
  });
};

let removeRequestContactSent = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
  
    let removeReq = await ContactModel.removeRequestContactSent(
      currentUserId,
      contactId,
    );
    // result.n === 0 sua k thanh cong else 1
    if (removeReq.n === 0) {
      return reject(false);
    }

    // Remove notification
    await NotificationModel.model.removeRequestContactSentNotification(
      currentUserId,
      contactId,
      NotificationModel.types.ADD_CONTACT,
    );

    resolve(true);
  });
};
let removeRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContactReceived(
      currentUserId,
      contactId,
    );
    //{n:0, nModified 0, ok: 1} 0 that bai
    if (removeReq.n === 0) {
      return reject(false);
    }
    resolve(true);
  });
};
let removeContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeContact = await ContactModel.removeContact(
      currentUserId,
      contactId,
    );
    // result.n === 0 sua k thanh cong else 1
    if (removeContact.n === 0) {
      return reject(false);
    }
    resolve(true);
  });
};
let acceptRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let acceptReq = await ContactModel.acceptRequestContactReceived(
      currentUserId,
      contactId,
    );

    //nModified === 0 sua khong thanh cong else 1 {n:0, nModified 0, ok: 1}
    if (acceptReq.nModified === 0) {
      return reject(false);
    }

    // Create Notification
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.types.ACCEPT_CONTACT,
    };

    await NotificationModel.model.createNew(notificationItem);

    resolve(true);
  });
};

let getContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(
        currentUserId,
        LIMIT_NUMBER_TAKEN,
      );
      let users = contacts.map(async (contact) => {
        // Logic quan trong
        // currentUserId: string  contact.contactId: object
        if (contact.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let getContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsSent(
        currentUserId,
        LIMIT_NUMBER_TAKEN,
      );

      let users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let getContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsReceived(
        currentUserId,
        LIMIT_NUMBER_TAKEN,
      );
      let users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsSent(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsReceived(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContacts = (currentUserId, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContacts(
        currentUserId,
        skipNumber,
        LIMIT_NUMBER_TAKEN,
      );
      let users = newContacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContactsSent = (currentUserId, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContactsSent(
        currentUserId,
        skipNumber,
        LIMIT_NUMBER_TAKEN,
      );
      let users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};
let readMoreContactsReceived = (currentUserId, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContactsReceived(
        currentUserId,
        skipNumber,
        LIMIT_NUMBER_TAKEN,
      );
      let users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  findUsersContact: findUsersContact,
  searchFriend: searchFriend,
  addNew: addNew,
  removeRequestContactSent: removeRequestContactSent,
  removeRequestContactReceived: removeRequestContactReceived,
  removeContact: removeContact,
  acceptRequestContactReceived: acceptRequestContactReceived,
  getContacts: getContacts,
  getContactsSent: getContactsSent,
  getContactsReceived: getContactsReceived,
  countAllContacts: countAllContacts,
  countAllContactsSent: countAllContactsSent,
  countAllContactsReceived: countAllContactsReceived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent: readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived,
};
