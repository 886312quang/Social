const socketioJwt = require("socketio-jwt");
const {
  pushSocketIdToArry,
  removeSocketIdFromArray,
} = require("../helpers/socketHelper");
const getCurrentUserInfo = require("../helpers/getCurrentUserInfo");
const getChatGroupIds = require("../helpers/getChatGroupIds");
const acceptRequestContactReceived = require("./contact/acceptRequestContactReceived");
const addContact = require("./contact/addContact");
const removeRequestContactReceived = require("./contact/removeRequestContactReceived");
const removeRequestContactSent = require("./contact/removeRequestContactSent");
const removeContact = require("./contact/removeContact");
const checkStatus = require("./status/checkStatus");
const sentMessage = require("./chat/sentMessage");
const typingOn = require("./chat/typingOn");
const typingOff = require("./chat/typingOff");
const createGroup = require("./chat/createGroup");
const addMemberToGroup = require("./chat/addMemberToGroup");
const removeMemberInGroup = require("./chat/removeMemberInGroup");
const changeNameGroup = require("./chat/changeNameGroup");
const changeAvatarGroup = require("./chat/changAvatarGroup");
const checkListenerStatus = require("./call/checkListenerStatus");
const listenerEmitPeerId = require("./call/listenerEmitPeerId");
const callerRequestCall = require("./call/callerRequestCall");
const callerCancelRequestCall = require("./call/callerCancelRequestCall");
const listenerRejectCall = require("./call/listenerRejectCall");
const listenerAnswerCall = require("./call/listenerAnwserCall");
const callEnded = require("./call/callEnded");
const likePost = require("./post/likePost");
const unLikePost = require("./post/unLikePost");

// Logger
const logger = require("../config/winton");
const { isObject } = require("lodash");
const createComment = require("./comment/createComment");

let initSockets = (io) => {
  io.use(
    socketioJwt.authorize({
      secret: process.env.ACCESS_TOKEN_SECRET,
      /*  "process.env.ACCESS_TOKEN_SECRET_MQ_9999" ||
        process.env.REFRESH_TOKEN_SECRET, */
      handshake: true,
    }),
  );
  //Reload will listen
  let clients = {};
  let newGroupChatId = "";

  //Connection
  io.on("connection", async (socket) => {
    try {
      const user = await getCurrentUserInfo(socket.decoded_token.data._id);
      let chatGroupIds = await getChatGroupIds(user._id);
      if (user) {
        clients = pushSocketIdToArry(
          clients,
          socket.decoded_token.data._id,
          socket.id,
        );
      }
      if (chatGroupIds) {
        chatGroupIds.forEach((group) => {
          clients = pushSocketIdToArry(clients, group._id, socket.id);
        });
      }

      // New Group Chat
      socket.on("create-new-group", (data) => {
        clients = pushSocketIdToArry(clients, data._id, socket.id);
        console.log(clients);
        createGroup(io, data, clients, user);
      });

      socket.on("member-received-group-chat", (data) => {
        newGroupChatId = data.groupChatId;
        clients = pushSocketIdToArry(clients, data.groupChatId, socket.id);
      });

      console.log(clients);
      logger.info(`Connect socket: ${Object.entries(clients)}`);

      // Config Socket

      // Check Status
      socket.on("check-status", () => {
        checkStatus(socket, clients, user);
      });
      // Contact
      socket.on("add-contact", (data) => {
        addContact(io, data, clients, user);
      });
      socket.on("accept-request-contact-received", (data) => {
        acceptRequestContactReceived(io, data, clients, user);
      });
      socket.on("remove-request-contact-received", (data) => {
        removeRequestContactReceived(io, data, clients, user);
      });
      socket.on("remove-request-sent-contact", (data) => {
        removeRequestContactSent(io, data, clients, user);
      });
      socket.on("remove-contact", (data) => {
        removeContact(io, data, clients, user);
      });

      // Comment 
      socket.on("createComment", (data) => {
        createComment(io, data, clients, user);
      });
      
      // Post
      socket.on("likePost", (data) => {
        likePost(io, data, clients, user);
      });
      socket.on("unlikePost", (data) => {
        unLikePost(io, data, clients, user);
      });

      // Chat
      socket.on("sent-message", (data) => {
        sentMessage(io, data, clients, user);
      });
      socket.on("typing-on", (data) => typingOn(io, data, clients, user));
      socket.on("typing-off", (data) => typingOff(io, data, clients, user));

      // Group
      socket.on("create-group", (data) => createGroup(io, data, clients, user));
      socket.on("add-member-to-group", (data) =>
        addMemberToGroup(io, data, clients, user),
      );
      socket.on("remove-member-in-group", (data) =>
        removeMemberInGroup(io, data, clients, user),
      );
      socket.on("change-name-group", (data) =>
        changeNameGroup(io, data, clients, user),
      );
      socket.on("change-avatar-group", (data) =>
        changeAvatarGroup(io, data, clients, user),
      );

      // Call
      // Step 01: check status
      socket.on("caller-server-check-listener-status", (data) => {
        checkListenerStatus(io, data, clients, user);
      });
      //Step 04: listener send peerId to server
      socket.on("listener-send-server-peer-id", (data) =>
        listenerEmitPeerId(io, data, clients, user),
      );
      //Step 06: caller request call
      socket.on("caller-server-request-call", (data) =>
        callerRequestCall(io, data, clients, user),
      );
      //Step 07: caller request cancel call
      socket.on("caller-server-cancel-request-call", (data) =>
        callerCancelRequestCall(io, data, clients, user),
      );
      //Step 10: listener reject call
      socket.on("listener-server-reject-call", (data) =>
        listenerRejectCall(io, data, clients, user),
      );
      //Step 11: listener accept call
      socket.on("listener-server-answer-call", (data) =>
        listenerAnswerCall(io, data, clients, user),
      );
      //Step End: on end call caller or listener
      socket.on("--server-call-ended", (data) =>
        callEnded(io, data, clients, user),
      );

      //Disconnect socket
      socket.on("disconnect", () => {
        clients = removeSocketIdFromArray(
          clients,
          socket.decoded_token.data._id,
          socket,
        );
        if (newGroupChatId) {
          clients = removeSocketIdFromArray(clients, newGroupChatId, socket);
        }
        chatGroupIds.forEach((group) => {
          clients = removeSocketIdFromArray(clients, group._id, socket);
        });
        //Step 99 Emit to all another user when has user offline
        socket.broadcast.emit("server-send-when-new-user-offline", user._id);
        console.log("disconnect");
        console.log(clients);
        logger.info(`Disconnect socket: ${Object.entries(clients)}`);
      });
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = initSockets;
