import Message from "../components/Shared/message";
import { getHistory } from "../configs/configureStore";
import * as constantLayout from "../constants/layout";
import constants from "../constants/message";
import services from "../services/messages";
import {
  emitAddMemberToGroup,
  emitCreateGroup,
  emitRemoveMemberInGroup,
  emitSentMessage,
} from "../sockets/chat";
import { emitCheckStatus } from "../sockets/checkStatus";
//import services from "../services/user";
import layoutActions from "../_actions/layout";

const actions = {
  doToggleScrollToBottom: () => ({
    type: constants.CHAT_SCROLL_TO_BOTTOM_TOGGLE,
  }),
  doClear: () => ({
    type: constants.CHAT_CLEAR_DATA,
  }),
  list: (data) => async (dispatch) => {
    try {
      dispatch({ type: constants.CHAT_GET_START });

      let groupSkip = data && data.groupSkip ? data.groupSkip : 0;
      let personSkip = data && data.personSkip ? data.personSkip : 0;
      let response = await services.getList({ groupSkip, personSkip });

      await dispatch({
        type: constants.CHAT_GET_SUCCESS,
        payload: {
          messages: response.data,
          skip: groupSkip + personSkip,
        },
      });
      emitCheckStatus();
    } catch (error) {
      Message.error("Get message fail!");
      dispatch({
        type: constants.CHAT_GET_ERROR,
      });
      getHistory().push("/");
    }
  },
  doCreate: (data) => async (dispatch) => {
    try {
      dispatch({ type: constants.CHAT_CREATE_START });

      const response = await services.createNewMessage(data);

      if (response.data.message) {
        dispatch({
          type: constants.CHAT_CREATE_SUCCESS,
          payload: response.data.message,
        });
        emitSentMessage({
          message: response.data.message,
          members: data.members,
        });
      }
    } catch (error) {
      Message.error("Send message fail!");
      dispatch({
        type: constants.CHAT_CREATE_ERROR,
      });
    }
  },
  doCreateImages: (data) => async (dispatch) => {
    try {
      dispatch({ type: constants.CHAT_CREATE_START });

      const response = await services.createNewMessageImages(data);

      if (response.data.message) {
        dispatch({
          type: constants.CHAT_CREATE_SUCCESS,
          payload: response.data.message,
        });
        emitSentMessage({
          message: response.data.message,
          members: data.members,
        });
      }
    } catch (error) {
      Message.error("Send message fail!");
      dispatch({
        type: constants.CHAT_CREATE_ERROR,
      });
    }
  },
  doCreateFiles: (data) => async (dispatch) => {
    try {
      dispatch({ type: constants.CHAT_CREATE_START });

      const response = await services.createNewMessageFiles(data);

      if (response.data.message) {
        dispatch({
          type: constants.CHAT_CREATE_SUCCESS,
          payload: response.data.message,
        });
        emitSentMessage({
          message: response.data.message,
          members: data.members,
        });
      }
    } catch (error) {
      Message.error("Send message fail!");
      dispatch({
        type: constants.CHAT_CREATE_ERROR,
      });
    }
  },
  doDeleteList: (data) => async () => {
    const response = await services.deleteList(data);
    return response;
  },
  listImage: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHAT_GET_IMAGE_LIST_START,
      });

      const response = await services.listImageFn(data);

      console.log(response.data)

      dispatch({
        type: constants.CHAT_GET_IMAGE_LIST_SUCCESS,
        payload: {
          images: response.data,
          skip: data.skip,
        },
      });
    } catch (error) {
      Message.error("Get list Image fail!");
      dispatch({
        type: constants.CHAT_GET_IMAGE_LIST_ERROR,
      });
    }
  },
  listFile: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHAT_GET_FILE_LIST_START,
      });

      const response = await services.listFileFn(data);

      dispatch({
        type: constants.CHAT_GET_FILE_LIST_SUCCESS,
        payload: {
          files: response.data,
          skip: data.skip,
        },
      });
    } catch (error) {
      Message.error("Get list File fail!");
      dispatch({
        type: constants.CHAT_GET_FILE_LIST_ERROR,
      });
    }
  },
  readMore:
    (id, skip = 0, limit = 30) =>
    async (dispatch) => {
      try {
        if (!id) {
          return;
        }
        dispatch({
          type: constants.READ_MORE_START,
        });

        const response = await services.readMore({ id, skip, limit });

        dispatch({
          type: constants.READ_MORE_SUCCESS,
          payload: { data: response.data, skip },
        });
        dispatch(layoutActions.doHideLeftSidebar());
      } catch (error) {
        Message.error("Read more message fail!");
        dispatch({
          type: constants.READ_MORE_ERROR,
        });
      }
    },
  doCreateGroup: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHAT_CREATE_GROUP_START,
      });

      const response = await services.createGroup(data);
      let messages = response.data;

      emitCreateGroup(messages);

      let lengthGroup = response.data.members.length;
      let nameCaption = response.data.members[+lengthGroup - 1].userName;

      dispatch(
        actions.doCreate({
          type: "notification",
          message: `${nameCaption} created the group.`,
          receiverId: response.data._id,
          sender: response.data.userId,
          conversationType: "ChatGroup",
          isChatGroup: true,
          members: response.data.members,
        }),
      );

      dispatch({
        type: constants.CHAT_CREATE_GROUP_SUCCESS,
        payload: messages,
      });

      dispatch({ type: constantLayout.LAYOUT_RIGHT_SIDEBAR_HIDE });
      dispatch({
        type: constants.CHANGE_CONVERSATION,
        payload: response.data._id,
      });
      dispatch({
        type: constants.TARGET_CONVERSATION,
        payload: response.data._id,
      });
      getHistory().push(`/m/${response.data._id}`);
    } catch (error) {
      Message.error("Create group fail!");
      dispatch({
        type: constants.CHAT_CREATE_GROUP_ERROR,
      });
    }
  },
  doRemoveMember: (data) => async (dispatch) => {
    try {
      await services.removeMember(data);
      dispatch({
        type: constants.CHAT_GROUP_REMOVE_MEMBER_SUCCESS,
        payload: { id: data.userId, chatGroupId: data.chatGroupId },
      });
      if (data.userId === data.currentUser._id) {
        getHistory().push("/");
        dispatch({
          type: constants.CHAT_GROUP_LEAVE,
          payload: { id: data.userId, chatGroupId: data.chatGroupId },
        });
      }
      emitRemoveMemberInGroup({
        id: data.userId,
        member: data.member,
        chatGroupId: data.chatGroupId,
        members: data.members,
      });

      if (data.currentUser._id !== data.userId) {
        dispatch(
          actions.doCreate({
            type: "notification",
            message: `${data.currentUser.userName} removed ${data.member.userName}`,
            receiverId: data.chatGroupId,
            sender: data.currentUser._id,
            conversationType: "ChatGroup",
            isChatGroup: true,
            members: data.members,
          }),
        );
      } else {
        dispatch({
          type: constants.CHAT_GROUP_LEAVE,
          payload: data.groupId,
        });
        getHistory().push("/");
      /*    dispatch({
          type: layoutConstants.LAYOUT_LEFT_SIDEBAR_SHOW,
        }); */
      }
    } catch (error) {
      Message.error("Leave group");
    }
  },
  doAddNewMembers: (data) => async (dispatch) => {
    try {
      let usersId = data.members.map((item) => item._id);
      await services.addMembers({ ...data, member: usersId });
      dispatch({
        type: constants.CHAT_GROUP_ADD_MEMBERS_SUCCESS,
        payload: { member: data.members, chatGroupId: data.chatGroupId },
      });
      emitAddMemberToGroup({
        member: data.members,
        chatGroupId: data.chatGroupId,
        messages: data.membersSocket,
      });
      let message = "";
      data.members.forEach((member) => {
        message += `${member.userName}`;
      });

      dispatch(
        actions.doCreate({
          type: "notification",
          message: `${data.currentUser.userName} added ${message}`,
          receiverId: data.chatGroupId,
          sender: data.currentUser._id,
          conversationType: "ChatGroup",
          isChatGroup: true,
          members: data.memberMessage,
        }),
      );
    } catch (error) {
      Message.error("Add member fail!");
    }
  },
  doChatGroupUpdate: (data) => async (dispatch) => {
    try {
      await services.updateChatGroup({
        name: data.name,
        id: data.id,
      });
      dispatch({
        type: constants.CHAT_GROUP_UPDATE_SUCCESS,
        payload: { name: data.name, id: data.id },
      });
      dispatch(
        actions.doCreate({
          type: "notification",
          message: data.message,
          receiverId: data.id,
          sender: data.currentUser._id,
          conversationType: "ChatGroup",
          isChatGroup: true,
          members: data.members,
        }),
      );
    } catch (error) {
      Message.error("Update group fail!");
    }
  },
};

export default actions;
