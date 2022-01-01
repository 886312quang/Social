import getSocket from "./rootSocket";
import constants from "../constants/message";
import getStore, { getHistory } from "../configs/configureStore";
import { toast } from "react-toastify";

export const emitChangeAvatarGroup = (payload) => {
  getSocket().emit("change-avatar-group", payload);
};

export const onChangAvatarGroup = (payload) => {
  getStore().dispatch({ type: constants.GROUP_CHANGE_AVATAR, payload });
};

export const onAddedToGroup = (payload) => {
  getStore().dispatch({ type: constants.ON_ADDED_TO_GROUP, payload });
  console.log(payload)
  toast.success(`Bạn đã được thêm vào nhóm chat! ${payload.name}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const emitChangeNameGroup = (payload) => {
  getSocket().emit("change-name-group", payload);
};
export const onChangeNameGroup = (payload) => {
  getStore().dispatch({ type: constants.ON_CHANGE_NAME_GROUP, payload });
};

export const emitRemoveMemberInGroup = (payload) => {
  getSocket().emit("remove-member-in-group", payload);
};

export const onRemoveMemberToGroup = (payload) => {
  if (!payload.deleted) {
    getStore().dispatch({
      type: constants.CHAT_GROUP_REMOVE_MEMBER_SUCCESS,
      payload,
    });
  } else {
    toast.warn("Bạn đã bị kích khỏi nhóm chat!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    getStore().dispatch({
      type: constants.CHAT_GROUP_KICK,
      payload,
    });
    getHistory().push("/");
  }
};

export const emitAddMemberToGroup = (payload) => {
  getSocket().emit("add-member-to-group", payload);
};
export const onAddMemberToGroup = (payload) => {
  getStore().dispatch({
    type: constants.CHAT_GROUP_ADD_MEMBERS_SUCCESS,
    payload,
  });
};
export const emitCreateGroup = (payload) => {
  getSocket().emit("create-new-group", payload);
};

export const onCreateGroup = (payload) => {
  const messages = payload.data;
  getStore().dispatch({
    type: constants.ON_CREATE_GROUP_SUCCESS,
    payload: messages,
  });
  getSocket().emit("member-received-group-chat", { groupChatId: messages._id });
};

export const emitSentMessage = (payload) => {
  getSocket().emit("sent-message", payload);
};

export const onSentMessage = (payload) => {
  getStore().dispatch({ type: constants.SOCKET_SENT_MESSAGE, payload });
};

export const emitTypingOn = (payload) => {
  getSocket().emit("typing-on", payload);
};

export const onTypingOn = (payload) => {
  getStore().dispatch({
    type: constants.SOCKET_TYPING_ON,
    payload: payload,
  });
};

export const emitTypingOff = (payload) => {
  getSocket().emit("typing-off", payload);
};

export const onTypingOff = (payload) => {
  getStore().dispatch({
    type: constants.SOCKET_TYPING_OFF,
    payload: payload,
  });
};

export const onDisconnect = () => {
  getStore().dispatch({
    type: constants.ON_DISCONNECT,
  });
};
