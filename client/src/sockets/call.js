import getSocket from "./rootSocket";
import constants from "../constants/call";
import getStore from "../configs/configureStore";
import { toast } from "react-toastify";
import notify from "../components/notifications/notifications";

let peer = null;

export const initPeer = (p) => {
  peer = p;
};

// Step01: emit event check Status
export const emitCheckListenerStatus = (payload) => {
  getSocket().emit("caller-server-check-listener-status", payload);
};

// Status listener
export const onListenerStatus = (payload) => {
  if (payload.status === "offline") {
    toast.error(`${payload.listener.userName}  is not online now.`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } else {
    // If online open popup
    getStore().dispatch({
      type: constants.CALL_RESPONSE_CONTACTING,
      payload: payload,
    });
  }
};

//On request peerId from server
export const onRequestPeerId = (payload) => {
  let state = getStore().getState();
  let getPeerId = state.call.peerId;

  getSocket().emit("listener-send-server-peer-id", {
    ...payload,
    peerId: getPeerId,
  });
};

//on peerId listener from server and call server
export const onResponseListenerPeerId = (payload) => {
  //Step 06. Call server
  getSocket().emit("caller-server-request-call", payload);
};

//Step 07: emit event caller cancel call
export const emitCallerCancelRequestCall = (payload) => {
  getSocket().emit("caller-server-cancel-request-call", payload);
};

//On event caller cancel call
export const onCancelRequestCall = (payload) => {
  getStore().dispatch({
    type: constants.CALL_CLEAR,
    payload: payload,
  });
};

//On event listener cancel call
export const onRejectCall = (payload) => {
  getStore().dispatch({
    type: constants.CALL_REJECT_CALL,
    payload: payload,
  });
};

//On event caller call
export const onRequestCall = (payload) => {
  getStore().dispatch({
    type: constants.CALL_REQUEST_CALL,
    payload: payload,
  });
};

//On listener accept call
export const onListenerAnswerCall = (payload) => {
  try {
    let state = getStore().getState();
    let peer = state.call.peer;

    getStore().dispatch({
      type: constants.CALL_LISTENER_ANSWER,
      payload: payload,
    });

    let getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    ).bind(navigator);

    if (peer) {
      peer.on("call", function (call) {
        getUserMedia({ video: true, audio: true }, function (stream) {
          getStore().dispatch({
            type: constants.CALL_LOCAL_STREAM,
            payload: stream,
          });

          call.answer(stream); // Answer the call with an A/V stream.
          call.on("stream", function (remoteStream) {
            // Show stream in some video/canvas element.
            getStore().dispatch({
              type: constants.CALL_REMOTE_STREAM,
              payload: remoteStream,
            });
          });
        });
      });
    }
  } catch (error) {
    console.log("Failed to get local stream", error);
    notify.error(error);
  }
};

// On event server send accept to caller
export const onCallerAnswerCall = (payload) => {
  try {
    let state = getStore().getState();
    let peer = state.call.peer;

    let peerId = payload.peerId;

    console.log(peerId);

    if (peerId) {
      let getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      ).bind(navigator);

      getStore().dispatch({
        type: constants.CALL_CALLER_ANSWER,
        payload: payload,
      });

      getUserMedia({ video: true, audio: true }, function (stream) {
        let c = peer.call(peerId, stream);
        if (c) {
          getStore().dispatch({
            type: constants.CALL_LOCAL_STREAM,
            payload: stream,
          });
          c.on("stream", function (remoteStream) {
            getStore().dispatch({
              type: constants.CALL_REMOTE_STREAM,
              payload: remoteStream,
            });
          });
        }
      });
    } else if (!peerId) {
      getStore().dispatch({
        type: constants.CALL_CLEAR,
        payload: payload,
      });
      notify.error("Không thể thực hiện cuộc gọi!");
      emitCallEnded({ id: payload.listener.id });
    }
  } catch (error) {
    console.log("Failed to get local stream", error);
    notify.error(error);
  }
};

//Step 10: emit reject call
export const emitRejectCall = (payload) => {
  getSocket().emit("listener-server-reject-call", payload);
};

//Step 11: emit accept call
export const emitAnswerCall = (payload) => {
  getSocket().emit("listener-server-answer-call", payload);
};

//On event 1 or 2 cancel
export const onCallEnded = () => {
  notify.info("Call ended");
  getStore().dispatch({
    type: constants.CALL_CALL_ENDED,
  });
};

//Emit event cancel call
export const emitCallEnded = (payload) => {
  getSocket().emit("--server-call-ended", payload);
};
