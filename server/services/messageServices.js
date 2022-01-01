const ContactModel = require("./../models/contactModel");
const UserModel = require("./../models/userModel");
const ChatGroupModel = require("./../models/chatGroupsModel");
const MessageModel = require("./../models/messageModel");
const { transErrors } = require("./../../lang/vi");
const _ = require("lodash");
const { app } = require("./../config/app");
const fsExtra = require("fs-extra");

const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;

/**
 * Get all Conversation
 * @param {string} currentUserId
 */
let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(
        currentUserId,
        LIMIT_CONVERSATIONS_TAKEN,
      );
      let userConversationsPromise = contacts.map(async (contact) => {
        // Logic quan trong
        // currentUserId: string  contact.contactId: object
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.userId,
          );
          //C1
          /* getUserContact = getUserContact.toObject();
          getUserContact.createdAt = "contact.createdAt"; */
          //C2 PV 2 thang deu lay tu mongoose nen su dung duoc nhu v
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.contactId,
          );
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });
      let userConversations = await Promise.all(userConversationsPromise);
      let groupConversations = await ChatGroupModel.getChatGroups(
        currentUserId,
        LIMIT_CONVERSATIONS_TAKEN,
      );
      let allConversations = userConversations.concat(groupConversations);
      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updatedAt; // - sx tu cao den thap + thap cao
      });

      // Get messages apply to screen chat
      let allConversationWithMessagePromise = allConversations.map(
        async (conversation) => {
          // Khac thang ben tren vi thang nay no la mang o tren cung du lieu
          conversation = conversation.toObject();

          if (conversation.members) {
            let getMessages = await MessageModel.model.getMessagesInGroups(
              conversation._id,
              LIMIT_MESSAGES_TAKEN,
            );
            conversation.messages = _.reverse(getMessages);

            // extras get userInfo
            conversation.memberInfo = [];
            for (let member of conversation.members) {
              let userInfo = await UserModel.getNormalUserDataById(
                member.userId,
              );
              conversation.memberInfo.push(userInfo);
            }
          } else {
            let getMessages = await MessageModel.model.getMessagesInPersonal(
              currentUserId,
              conversation._id,
              LIMIT_MESSAGES_TAKEN,
            );
            conversation.messages = _.reverse(getMessages);
          }
          return conversation;
        },
      );

      let allConversationWithMessages = await Promise.all(
        allConversationWithMessagePromise,
      );

      allConversationWithMessages = _.sortBy(
        // sort by updatedAt
        allConversationWithMessages,
        (item) => {
          return -item.updatedAt;
        },
      );

      resolve({
        allConversationWithMessages: allConversationWithMessages, //All messages apply screen
      });
    } catch (error) {
      reject(error);
    }
  });
};
/**
 * add new message
 * @param {string} sender currentUserID
 * @param {string} receivedId id of an user or a group
 * @param {string} messageVal val
 * @param {boolean} isChatGroup check group
 */
let addNewTextEmoji = (sender, receivedId, messageVal, isChatGroup, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(
          receivedId,
        );

        if (!getChatGroupReceiver) {
          reject(transErrors.conversation_not_found);
        }
        let conversationType;
        if (type === "notification") {
          conversationType = MessageModel.conversationType.NOTIFICATION;
        } else {
          conversationType = MessageModel.conversationType.GROUP;
        }

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: getChatGroupReceiver.avatar,
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: conversationType,
          messageType: MessageModel.messageType.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now(),
        };

        let newMessage = await MessageModel.model.createNew(newMessageItem);

        // update group chat
        await ChatGroupModel.updateWhenAddNewMessage(
          getChatGroupReceiver._id,
          getChatGroupReceiver.messageAmount + 1,
        );
        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getNormalUserDataById(receivedId);

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.userName,
          avatar: getUserReceiver.avatar,
        };
        //item message
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now(),
        };
        // New message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        await ContactModel.updateWhenAddNewMessage(sender.id, receiver.id);
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * add new message Images
 * @param {string} sender
 * @param {string} receivedId
 * @param {file} messageVal
 * @param {boolean} isChatGroup
 */
let addNewImage = (sender, receivedId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(
          receivedId,
        );
        if (!getChatGroupReceiver) {
          reject(transErrors.conversation_not_found);
        }
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: getChatGroupReceiver.avatar,
        };

        /* let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname; */
        //item message
        const getNewMessage = async (item) => {
          let messages = {
            data: await fsExtra.readFile(item.pathAdd),
            contentType: "images",
            fileName: item.name,
          };
          return messages;
        };

        let fileCreatePromise = messageVal.map(getNewMessage);

        let fileCreate = await Promise.all(fileCreatePromise);

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.IMAGE,
          sender: sender,
          receiver: receiver,
          file: fileCreate,
          createdAt: Date.now(),
        };
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // update group chat
        await ChatGroupModel.updateWhenAddNewMessage(
          getChatGroupReceiver._id,
          getChatGroupReceiver.messageAmount + 1,
        );
        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getNormalUserDataById(receivedId);

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.userName,
          avatar: getUserReceiver.avatar,
        };

        //item message
        const getNewMessage = async (item) => {
          let messages = {
            data: await fsExtra.readFile(item.pathAdd),
            contentType: "images",
            fileName: item.name,
          };
          return messages;
        };

        let fileCreatePromise = messageVal.map(getNewMessage);

        let fileCreate = await Promise.all(fileCreatePromise);

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.IMAGE,
          sender: sender,
          receiver: receiver,
          file: fileCreate,
          createdAt: Date.now(),
        };
        // New message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        await ContactModel.updateWhenAddNewMessage(sender.id, receiver.id);
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * add new messageAttachment
 * @param {string} sender
 * @param {string} receivedId
 * @param {file} messageVal
 * @param {boolean} isChatGroup
 */
let addNewAttachment = (sender, receivedId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(
          receivedId,
        );
        if (!getChatGroupReceiver) {
          reject(transErrors.conversation_not_found);
        }
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: getChatGroupReceiver.avatar,
        };

        //item files
        const getNewMessage = async (item) => {
          let messages = {
            data: await fsExtra.readFile(item.pathAdd),
            contentType: "file",
            fileName: item.name,
          };
          return messages;
        };

        let fileCreatePromise = messageVal.map(getNewMessage);

        let fileCreate = await Promise.all(fileCreatePromise);

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.FILE,
          sender: sender,
          receiver: receiver,
          file: fileCreate,
          createdAt: Date.now(),
        };
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // update group chat
        await ChatGroupModel.updateWhenAddNewMessage(
          getChatGroupReceiver._id,
          getChatGroupReceiver.messageAmount + 1,
        );
        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getNormalUserDataById(receivedId);

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.userName,
          avatar: getUserReceiver.avatar,
        };
        //item files
        const getNewMessage = async (item) => {
          let messages = {
            data: await fsExtra.readFile(item.pathAdd),
            contentType: "file",
            fileName: item.name,
          };
          return messages;
        };

        let fileCreatePromise = messageVal.map(getNewMessage);

        let fileCreate = await Promise.all(fileCreatePromise);

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.FILE,
          sender: sender,
          receiver: receiver,
          file: fileCreate,
          createdAt: Date.now(),
        };
        // New message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        await ContactModel.updateWhenAddNewMessage(sender.id, receiver.id);
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Read more all chat
 * @param {string} currentUserId
 * @param {number} skipPersonal
 * @param {number} skipGroup
 */
let readMoreAllChat = (currentUserId, skipPersonal, skipGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.readMoreContacts(
        currentUserId,
        skipPersonal,
        LIMIT_CONVERSATIONS_TAKEN,
      );
      let userConversationsPromise = contacts.map(async (contact) => {
        // Logic quan trong
        // currentUserId: string  contact.contactId: object
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.userId,
          );
          //C1
          /* getUserContact = getUserContact.toObject();
          getUserContact.createdAt = "contact.createdAt"; */
          //C2 PV 2 thang deu lay tu mongoose nen su dung duoc nhu v
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.contactId,
          );
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });
      let userConversations = await Promise.all(userConversationsPromise);

      let groupConversations = await ChatGroupModel.readMoreChatGroup(
        currentUserId,
        skipGroup,
        LIMIT_CONVERSATIONS_TAKEN,
      );
      let allConversations = userConversations.concat(groupConversations);
      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updatedAt; // - sx tu cao den thap + thap cao
      });

      // Get messages apply to screen chat
      let allConversationWithMessagePromise = allConversations.map(
        async (conversation) => {
          // Khac thang ben tren vi thang nay no la mang o tren cung du lieu
          conversation = conversation.toObject();

          if (conversation.members) {
            let getMessages = await MessageModel.model.getMessagesInGroups(
              conversation._id,
              LIMIT_MESSAGES_TAKEN,
            );
            conversation.messages = _.reverse(getMessages);
          } else {
            let getMessages = await MessageModel.model.getMessagesInPersonal(
              currentUserId,
              conversation._id,
              LIMIT_MESSAGES_TAKEN,
            );
            conversation.messages = _.reverse(getMessages);
          }
          return conversation;
        },
      );

      let allConversationWithMessages = await Promise.all(
        allConversationWithMessagePromise,
      );

      allConversationWithMessages = _.sortBy(
        // sort by updatedAt
        allConversationWithMessages,
        (item) => {
          return -item.updatedAt;
        },
      );

      resolve(allConversationWithMessages);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * @param {string} currentUserId
 * @param {number} skipMessage
 * @param {string} targetId
 * @param {boolean} chatInGroup
 */
let readMore = (currentUserId, skipMessage, targetId, chatInGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Message in group
      if (chatInGroup) {
        let getMessages = await MessageModel.model.readMoreMessagesInGroups(
          targetId,
          skipMessage,
          LIMIT_MESSAGES_TAKEN,
        );
        getMessages = _.reverse(getMessages);
        return resolve(getMessages);
      }
      // Message in personal
      let getMessages = await MessageModel.model.readMoreMessagesInPersonal(
        currentUserId,
        targetId,
        skipMessage,
        LIMIT_MESSAGES_TAKEN,
      );
      getMessages = _.reverse(getMessages);
      return resolve(getMessages);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * List Images
 * @param {string} userId
 * @param {string} receivedId
 * @param {number} skip
 * @param {number} limit
 */
let listImageOrFile = (userId, receiverId, skip, limit, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      let listImageOrFile = await MessageModel.model.getListImageOrFile(
        userId,
        receiverId,
        skip,
        limit,
        type,
      );

      listImageOrFile = _.reverse(listImageOrFile);

      return resolve(listImageOrFile);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
module.exports = {
  getAllConversationItems: getAllConversationItems,
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage,
  addNewAttachment: addNewAttachment,
  readMoreAllChat: readMoreAllChat,
  readMore: readMore,
  listImageOrFile,
};
