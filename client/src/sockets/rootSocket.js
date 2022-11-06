import io from "socket.io-client";

import {
  onAddContact,
  onAcceptRequestContact,
  onRemoveRequestContact,
  onRemoveRequestSentContact,
  onRemoveContact,
} from "./contact";
import {
  onListUserOnline,
  onNewUserOnline,
  onNewUserOffline,
} from "./checkStatus";
import { isAuthenticated } from "../router/permissionChecker";
import {
  onSentMessage,
  onTypingOn,
  onTypingOff,
  onDisconnect,
  onCreateGroup,
  onAddMemberToGroup,
  onRemoveMemberToGroup,
  onAddedToGroup,
  onChangeNameGroup,
  onChangAvatarGroup,
} from "./chat";
import {
  onListenerStatus,
  onRequestPeerId,
  onResponseListenerPeerId,
  onCancelRequestCall,
  onRejectCall,
  onRequestCall,
  onListenerAnswerCall,
  onCallerAnswerCall,
  onCallEnded,
} from "./call";
import { onLikepost, onUnlikepost } from "./post";
import { onCreateComment } from "./comment";
const endpoint = process.env.REACT_APP_SOCKET_ENDPOINT;

let socket = null;

const onConnected = () => {};

export const configSocket = () => {
  if (socket && socket.disconnected) {
    socket.connect();
  }
  if (socket) return;
  socket = io.connect(endpoint, {
    path: "/chat/socket.io",
    query: `token=${isAuthenticated()}`,
  });
  if (socket) {
    socket.on("connect", onConnected);
    socket.on("disconnect", onDisconnect);

    // Contact
    socket.on("response-add-contact", onAddContact);
    socket.on(
      "response-accept-request-contact-received",
      onAcceptRequestContact,
    );
    socket.on(
      "response-remove-request-contact-received",
      onRemoveRequestContact,
    );
    socket.on(
      "response-remove-request-sent-contact",
      onRemoveRequestSentContact,
    );
    socket.on("response-remove-contact", onRemoveContact);
    socket.on("server-send-list-users-online", onListUserOnline);
    socket.on("server-send-when-new-user-online", onNewUserOnline);
    socket.on("server-send-when-new-user-offline", onNewUserOffline);
    socket.on("response-sent-message", onSentMessage);
    socket.on("response-typing-on", onTypingOn);
    socket.on("response-typing-off", onTypingOff);

    // Group Chat
    socket.on("response-new-group-created", onCreateGroup);
    socket.on("response-add-member-to-group", onAddMemberToGroup);
    socket.on("response-remove-member-in-group", onRemoveMemberToGroup);
    socket.on("response-added-to-group", onAddedToGroup);
    socket.on("response-change-name-group", onChangeNameGroup);
    socket.on("response-change-avatar-group", onChangAvatarGroup);

    // Comment
    socket.on("response-create-comment", onCreateComment);

    // Post
    socket.on("response-like-post", onLikepost);
    socket.on("response-unlike-post", onUnlikepost);
    // Call
    //Step 1,2
    socket.on("server-caller-listener-status", onListenerStatus);
    //Step 3,4
    socket.on("server-listener-request-peer-id", onRequestPeerId);
    //Step 5,6
    socket.on("server-caller-listener-peer-id", onResponseListenerPeerId);
    //Step 08: server send request call to listener
    socket.on("server-listener-request-call", onRequestCall);
    //Step 7: on event server send caller cancel rq call
    socket.on("server-listener-cancel-request-call", onCancelRequestCall);
    //Step 10: on event server send listener cancel rq call
    socket.on("server-caller-reject-call", onRejectCall);
    //Step 13: on event call success to caller
    socket.on("server-caller-answer-call", onCallerAnswerCall);
    //Step 14: on event call success to listener
    socket.on("server-listener-answer-call", onListenerAnswerCall);
    //Step 15: on cancel 2 phia
    socket.on("server--call-ended", onCallEnded);
    
    return socket;
  } else {
    return;
  }
};

export const socketDisconnect = () => {
  socket.disconnect();
  socket = null;
};

export default function getSocket() {
  return socket;
}
