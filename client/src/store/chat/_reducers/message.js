import constants from "../constants/message";
import * as constantsContact from "../constants/contact";
import produce from "immer";
import playBell from "../components/Shared/sound/bell";
import message from "../constants/message";

const initialState = {
  initLoading: true,
  messageListLoading: false,
  hasMoreMessageList: true,
  sending: false,
  scrollToBottom: false,
  findLoading: false,
  hasMoreConversation: false,
  getImageListLoading: false,
  getFileListLoading: false,
  target: false,
  error: null,
  record: null,
  messages: [],
  inputMessage: {
    images: [],
    text: "",
    files: [],
  },
  typing: {},
  imageList: [],
  skipImageList: 0,
  fileList: [],
  skipFileList: 0,
};

const messageReducer = (state = initialState, { type, payload }) =>
  produce(state, (draft) => {
    let bufferToBase64 = (bufferFrom) => {
      return Buffer.from(bufferFrom).toString("base64");
    };
    switch (type) {
      case constants.SOCKET_SENT_MESSAGE:
        if (payload.conversationType === "personal") {
          draft.messages.forEach((message, index) => {
            if (
              message._id === payload.senderId ||
              message._id === payload.receiverId
            ) {
              draft.messages[index].messages.push(payload);
              draft.messages[index].updatedAt = Date.now();
              if (
                (draft.record && draft.record._id !== payload.senderId) ||
                !draft.record
              ) {
                message.nSeen = true;
              }
            }
          });
          if (draft.record && draft.record._id === payload.senderId) {
            draft.record.messages.push(payload);
            draft.scrollToBottom = true;
          }
          if (draft.record && draft.record._id === payload.senderId) {
            playBell("sent");
          } else {
            playBell("new-message");
          }
        } else if (
          payload.conversationType === "group" ||
          payload.conversationType === "notification"
        ) {
          draft.messages.forEach((message, index) => {
            if (message._id === payload.receiverId) {
              draft.messages[index].messages.push(payload);
              draft.messages[index].updatedAt = Date.now();
              if (
                (draft.record && draft.record._id !== payload.receiverId) ||
                !draft.record
              ) {
                message.nSeen = true;
              }
            }
          });
          if (draft.record && draft.record._id === payload.receiverId) {
            draft.record.messages.push(payload);
            draft.scrollToBottom = true;
          }
          if (draft.record && draft.record._id === payload.receiverId) {
            playBell("sent");
          } else {
            playBell("new-message");
          }
        }
        break;
      case constants.SOCKET_TYPING_ON:
        if (state.record) {
          if (state.record._id === payload.info._id) {
            draft.typing.status = true;
            draft.typing.status = true;
            draft.typing.info = payload.info;
            draft.scrollToBottom = true;
            playBell("typing");
          }
        }
        break;
      case constants.SOCKET_TYPING_OFF:
        if (state.record) {
          if (state.record._id === payload.info._id) {
            draft.typing = {};
          }
        }
        break;
      case constants.INPUT_MESSAGE_CHANGE:
        draft.inputMessage.text = payload;
        break;
      case constants.CHANGE_CONVERSATION:
        draft.messages.forEach((message) => {
          if (message._id === payload.userId) {
            message.nSeen = false;
          }
        });
        draft.inputMessage.text = "";
        draft.inputMessage.files = [];
        draft.inputMessage.images = [];
        break;
      case constants.CHAT_CREATE_START:
        draft.sending = true;
        draft.error = null;
        break;
      case constants.CHAT_CREATE_SUCCESS:
        draft.record.messages.push(payload);
        draft.messages.forEach((message, index) => {
          if (message._id === payload.receiverId) {
            draft.messages[index].messages.push(payload);
            draft.messages[index].updatedAt = Date.now();
          }
        });
        if (payload.messageType === "image") {
          payload.file.forEach((i) => {
            draft.imageList.push({
              src: `data: ${i.contentType}; base64, ${bufferToBase64(i.data)}
        `,
            });
          });
        }
        if (payload.messageType === "file") {
          payload.file.forEach((i) => {
            draft.fileList.push({
              href: `data: ${i.contentType}; base64, ${bufferToBase64(i.data)}
              `,
              download: `${i.fileName}`,
              name: `${i.fileName}`,
            });
          });
        }
        draft.sending = false;
        draft.error = null;
        break;
      case constants.CHAT_CREATE_ERROR:
        draft.sending = false;
        draft.error = payload;
        break;
      case constants.CHAT_GET_START:
        draft.messageListLoading = true;
        draft.hasMoreMessageList = true;
        draft.error = null;
        draft.typing = {};
        draft.sending = false;
        break;
      case constants.CHAT_GET_SUCCESS:
        draft.messageListLoading = false;
        if (payload.skip && payload.skip > 0) {
          // Nếu skip > 0 => Load more
          if (payload.messages.length < 1) {
            // Nếu không còn message list => hasMore = false
            draft.hasMoreMessageList = false;
          }
          draft.messages = state.messages.concat(payload.messages);
        } else {
          // Get messages list lần đầu tiên
          draft.messages = payload.messages;
        }
        draft.error = null;
        break;
      case constantsContact.LIST_USER_ONLINE:
        draft.messages.forEach((user) => {
          payload.forEach((i) => {
            if (user._id === i) {
              user.online = true;
            }
          });
        });
        break;
      case constantsContact.NEW_USER_ONLINE:
        draft.messages.forEach((user) => {
          if (user._id === payload) {
            user.online = true;
          }
        });
        break;
      case constantsContact.NEW_USER_OFFLINE:
        draft.messages.forEach((user) => {
          if (user._id === payload) {
            user.online = false;
          }
        });
        break;
      case constantsContact.ON_ACCEPT_REQUEST_ADD:
        draft.messages.unshift(payload);
        break;
      case constantsContact.ACCEPT_CONTACT_SUCCESS:
        draft.messages.unshift(payload.userContact);
        break;
      case constantsContact.CONTACT_REMOVE_CONTACT_SUCCESS:
        draft.messages = state.messages.filter(
          (message) => message._id !== payload,
        );
        break;
      case constants.TARGET_UPDATE_USER:
        if (draft.record) {
          draft.record = null;
        }
        break;
      case constants.TARGET_CONVERSATION_START:
        draft.findLoading = true;
        draft.typing = {};
        draft.sending = false;
        draft.hasMoreConversation = true;
        break;
      case constants.CLICK_TARGET:
        draft.target = true;
        break;
      case constants.TARGET_CONVERSATION:
        draft.findLoading = false;
        draft.skipImageList = 0;
        draft.skipFileList = 0;
        draft.fileList = [];
        draft.imageList = [];
        if (payload) {
          state.messages.forEach((message) => {
            if (message._id === payload.userId) {
              draft.record = message;
              draft.hasMoreConversation = true;
            }
          });
        } else {
          draft.hasMoreConversation = false;
          draft.record = null;
        }
        break;
      // Send Photos
      case constants.INPUT_IMAGE_LIST_CHANGE:
        draft.inputMessage.images = payload;
        break;
      case constants.INPUT_FILE_LIST_CHANGE:
        draft.inputMessage.files = payload;
        break;
      // Scroll_To_BOTTOM
      case constants.CHAT_SCROLL_TO_BOTTOM_TOGGLE:
        draft.scrollToBottom = !state.scrollToBottom;
        break;
      // List
      case constants.CHAT_GET_IMAGE_LIST_START:
        draft.getImageListLoading = true;
        break;
      case constants.CHAT_GET_IMAGE_LIST_SUCCESS:
        draft.getImageListLoading = false;
        let tempImages = [];
        payload.images.forEach((image) => {
          image.file.forEach((i) => {
            tempImages.push({
              src: `data: ${i.contentType}; base64, ${bufferToBase64(i.data)}
        `,
            });
          });
        });
        if (payload.skip) {
          // Nếu tồn tại skip => xem thêm
          draft.imageList = draft.imageList.concat(tempImages);
        } else {
          draft.imageList = tempImages;
        }
        draft.skipImageList = state.skipImageList + payload.images.length;

        break;
      case constants.CHAT_GET_IMAGE_LIST_ERROR:
        draft.getImageListLoading = false;
        break;
      case constants.CHAT_GET_FILE_LIST_START:
        draft.getFileListLoading = true;
        break;
      case constants.CHAT_GET_FILE_LIST_SUCCESS:
        draft.getFileListLoading = false;
        let tempFile = [];
        payload.files.forEach((file) => {
          file.file.forEach((i) => {
            tempFile.push({
              href: `data: ${i.contentType}; base64, ${bufferToBase64(i.data)}
          `,
              download: `${i.fileName}`,
              name: `${i.fileName}`,
            });
          });
        });
        if (payload.skip) {
          // Nếu tồn tại skip => xem thêm
          draft.fileList = draft.fileList.concat(tempFile);
        } else {
          draft.fileList = tempFile;
        }
        draft.skipFileList = state.skipFileList + payload.files.length;

        break;
      case constants.CHAT_GET_FILE_LIST_ERROR:
        draft.getFileListLoading = false;
        break;
      // Read more
      case constants.READ_MORE_START:
        draft.findLoading = true;
        draft.error = null;
        draft.typing = {};
        draft.sending = false;
        draft.hasMoreConversation = true;
        break;
      case constants.READ_MORE_SUCCESS:
        draft.findLoading = false;
        if (payload && payload.skip && payload.data) {
          if (payload.data.length === 0) {
            draft.hasMoreConversation = false;
          } else {
            draft.record.messages = payload.data.concat(state.record.messages);
          }
        } else {
          if (payload && payload.data) {
            draft.record = payload.data;
          }
        }
        draft.error = null;
        break;
      case constants.READ_MORE_ERROR:
        draft.findLoading = false;
        draft.record = null;
        draft.hasMoreConversation = false;
        draft.error = payload;
        break;
      // Group
      case constants.CHAT_CREATE_GROUP_START:
        draft.findLoading = false;
        break;
      case constants.CHAT_CREATE_GROUP_SUCCESS:
        draft.findLoading = false;
        draft.messages.unshift(payload);
        break;
      case constants.CHAT_CREATE_GROUP_ERROR:
        draft.findLoading = false;
        break;
      case constants.ON_CREATE_GROUP_SUCCESS:
        if (payload) {
          draft.messages.unshift(payload);
        }
        break;
      case constants.CHAT_GROUP_REMOVE_MEMBER_SUCCESS:
        if (draft.record && draft.record.members) {
          draft.record.members = draft.record.members.filter(
            (item) => item._id !== payload.id,
          );
        }
        state.messages.forEach((message, index) => {
          if (message._id === payload.chatGroupId) {
            draft.messages[index].members = draft.messages[
              index
            ].members.filter((item) => item._id !== payload.id);
          }
        });
        break;
      case constants.CHAT_GROUP_ADD_MEMBERS_SUCCESS:
        if (draft.record && draft.record.members) {
          draft.record.members = draft.record.members.concat(payload.member);
        }
        state.messages.forEach((message, index) => {
          if (message._id === payload.chatGroupId) {
            draft.messages[index].members = payload.member.concat(
              state.messages[index].members,
            );
          }
        });
        break;
      case constants.CHAT_GROUP_KICK:
        draft.messages = state.messages.filter(
          (message) => message._id !== payload.chatGroupId,
        );
        if (draft.record && draft.record._id === payload.chatGroupId) {
          draft.record = null;
        }
        break;
      case constants.CHAT_GROUP_LEAVE:
        if (draft.record && draft.record._id === payload.chatGroupId) {
          draft.record = null;
        }
        draft.messages = state.messages.filter(
          (message) => message._id !== payload.id,
        );
        break;
      case constants.ON_ADDED_TO_GROUP:
        draft.messages.unshift(payload);
        break;
      case constants.CHAT_GROUP_CHANGE_AVATAR:
        draft.record.avatar = payload.avatar;
        state.messages.forEach((item, index) => {
          if (item._id === payload.chatGroupId) {
            draft.messages[index].avatar = payload.avatar;
            return;
          }
        });
        break;
      case constants.CHAT_GROUP_UPDATE_SUCCESS:
        draft.updateChatGroupLoading = false;
        draft.record.name = payload.name;
        state.messages.forEach((item, index) => {
          if (item._id === payload.id) {
            draft.messages[index].name = payload.name;
          }
        });
        break;
      case constants.ON_CHANGE_NAME_GROUP:
        if (draft.record && draft.record._id === payload.id) {
          draft.record.name = payload.name;
        } else {
          state.messages.forEach((item, index) => {
            if (item._id === payload.id) {
              draft.messages[index].name = payload.name;
            }
          });
        }
        break;
      case constants.GROUP_CHANGE_AVATAR:
        state.messages.forEach((item, index) => {
          if (item._id === payload.id) {
            draft.messages[index].avatar = payload.avatar;
          }
        });
        if (draft.record && draft.record._id === payload.id) {
          draft.record.avatar = payload.avatar;
        }
        break;
      default:
        break;
    }
  });

export default messageReducer;
