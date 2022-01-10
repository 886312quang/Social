import constants from "../constants/call";
import services from "../services/call";
import getStore, { getHistory } from "../configs/configureStore";
import { toast } from "react-toastify";
import Peer from "peerjs";

export default {
  getPeerId: (peerId) => (dispatch) => {
    dispatch({ type: constants.CALL_GET_PEER_ID, payload: peerId });
  },
  doClear: () => (dispatch) => {
    dispatch({ type: constants.CALL_CLEAR });
  },
  doSetAudioVideoSource: (data) => (dispatch) => {
    dispatch({
      type: constants.CALL_SET_AUDIO_VIDEO_SOURCE,
      payload: data,
    });
  },
  doCallEnded: () => (dispatch) => {
    dispatch({ type: constants.CALL_CALL_ENDED });
  },
  doGetIceServer: () => async (dispatch) => {
    try {
      const response = await services.getIceServer();
      let getPeerId = null;

      dispatch({
        type: constants.CALL_GET_ICE_SERVER_SUCCESS,
        payload: response.data,
      });

      const peer = new Peer({
        key: "peerjs",
        host: "peerjs-server-trungquandev.herokuapp.com",
        secure: true,
        port: 443,
        config: { iceServers: response.data },
        debug: 3,
      });

      peer.on("open", async (peerId) => {
        getPeerId = peerId;
        await dispatch({
          type: constants.CALL_CREATE_PEER,
          payload: peer,
        });
        await dispatch({
          type: constants.CALL_GET_PEER_ID,
          payload: peerId,
        });
      });

      // getPeerId(response.data.ice);

      // getPeerId(iceServer);
      // chat.manhpham.xyz / peerjs - aschat;
      // const peer = new peerjs({
      //     key: "peerjs",
      //     host: "peerjs-achat.herokuapp.com",
      //     secure: "true",
      //     port: 443,
      //     debug: 3,
      //     // config: { iceServers: iceserver },
      // });
      // initPeer(peer);
      // dispatch({
      //     type: constants.CALL_CREATE_PEER,
      //     payload: peer,
      // });
      // peer.on("open", (peerId) => {
      //     dispatch({
      //         type: constants.CALL_GET_PEER_ID,
      //         payload: peerId,
      //     });
      // });
    } catch (error) {
      console.log(error);
    }
  },
};
