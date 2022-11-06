import getSocket from "./rootSocket";
import notify from "../components/notifications/notifications";
import playBell from "../sound/bell";
import * as constant from "../constants/contact";
import * as notifyContant from "../constants/notification";
import getStore from "../configs/configureStore";
import { POST_TYPES } from "../store/_actions/post";

// Config socket contact

export const emitCreateComment = (payload) => {
  getSocket().emit("createComment", payload);
};

export const onCreateComment = (payload) => {
  getStore().dispatch({ type: POST_TYPES.UPDATE_POST, payload: payload.data });

  if (payload?.notify)
    getStore().dispatch({
      type: notifyContant.ON_NOTIFICATION_REQUEST_ADD,
      payload: payload.notify,
    });
};

export const emitUnlikePost = (payload) => {
  getSocket().emit("unlikePost", payload);
};

export const onUnlikepost = (payload) => {
  getStore().dispatch({ type: POST_TYPES.UPDATE_POST, payload: payload });
};

export const emitAcceptRequestContact = (payload) => {
  getSocket().emit("accept-request-contact-received", payload);
};

export const onAcceptRequestContact = (payload) => {
  playBell("notification");
  getStore().dispatch({ type: constant.ON_ACCEPT_REQUEST_ADD, payload });
  getStore().dispatch({
    type: notifyContant.ON_NOTIFICATION_REQUEST_ADD,
    payload,
  });
};

export const emitRemoveRequestContact = (payload) => {
  getSocket().emit("remove-request-contact-received", payload);
};

export const onRemoveRequestContact = (payload) => {
  getStore().dispatch({ type: constant.ON_REMOVE_REQUEST_ADD, payload });
};

export const emitRemoveRequestSentContact = (payload) => {
  getSocket().emit("remove-request-sent-contact", payload);
};

export const onRemoveRequestSentContact = (payload) => {
  getStore().dispatch({ type: constant.ON_REMOVE_REQUEST_SENT_ADD, payload });
  getStore().dispatch({ type: notifyContant.ON_REMOVE_NOTIFICATION, payload });
};

export const emitRemoveContact = (payload) => {
  getSocket().emit("remove-contact", payload);
};

export const onRemoveContact = (payload) => {
  getStore().dispatch({ type: constant.ON_REMOVE_CONTACT, payload });
};
