import React, { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import selectors from "../../../../store/_selectors/message";
import actions from "../../../../store/_actions/message";
import constants from "../../../../constants/message";
import userSelectors from "../../../../store/_selectors/user";
import layoutSelectors from "../../../../store/_selectors/layout";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
//import { emitTypingOn, emitTypingOff } from "./socket";
import { isAuthenticated } from "../../../../router/permissionChecker";
import { emitTypingOff, emitTypingOn } from "../../../../sockets/chat";
import { Upload, Popover } from "antd";

let typingTimer = null;

function delay(callback, ms) {
  window.clearTimeout(typingTimer);
  typingTimer = setTimeout(function () {
    callback();
  }, 1500);
}

function ChatContentFooter() {
  const inputMessageRef = useRef();
  const dispatch = useDispatch();

  // State
  const [emojiVisible, setEmojiVisible] = useState(false);
  const [typing, setTyping] = useState(false);
  const [textInput, setTextInput] = useState("");

  // Selector
  const record = useSelector(selectors.selectRecord);
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const inputMessage = useSelector(selectors.selectInputMessage);
  // Layout
  const isMobileDevice = useSelector(layoutSelectors.selectIsMobileDevice);

  const isChatGroup = record && record.members ? true : false;
  const members = record && record.members ? record.members : null;

  const handleTypingOff = () => {
    emitTypingOff({
      info: currentUser,
      receiverId: record._id,
      //conversationType: record.conversationType,
    });
  };

  const onInputMessageChange = (message) => {
    dispatch({
      type: constants.INPUT_MESSAGE_CHANGE,
      payload: message,
    });
    if (message.trim() === "") {
      handleTypingOff();
    }
  };

  const onInputImageListChange = ({ fileList }) => {
    dispatch({
      type: constants.INPUT_IMAGE_LIST_CHANGE,
      payload: [...fileList],
    });
  };

  const onInputFileListChange = ({ fileList }) => {
    dispatch({
      type: constants.INPUT_FILE_LIST_CHANGE,
      payload: [...fileList],
    });
  };

  const addEmoji = (e) => {
    onInputMessageChange(inputMessage.text + e.native);
    if (!isMobileDevice) inputMessageRef.current.focus();
  };

  const sendText = () => {
    // Gửi text và emoji
    if (inputMessage.text.trim() !== "") {
      dispatch(
        actions.doCreate({
          message: inputMessage.text,
          receiverId: record._id,
          conversationType: record.conversationType,
          isChatGroup: isChatGroup,
          members: members,
        })
      );
      dispatch(actions.doToggleScrollToBottom());
      onInputMessageChange("");
    }
  };

  const sendImage = () => {
    // Nếu đang uploading thì không gửi
    let uploading = false;
    inputMessage?.images?.forEach((item) => {
      if (item?.status === "uploading") uploading = true;
    });
    if (uploading) return;
    if (inputMessage?.images?.length > 0) {
      // gửi hình ảnh
      let images = [];
      inputMessage.images.forEach((item) => {
        if (item?.response?.name) {
          images.push(item?.response);
        }
      });

      dispatch(
        actions.doCreateImages({
          images,
          type: "image",
          receiver: record?._id,
          conversationType: record?.conversationType,
          isChatGroup: isChatGroup,
          members: members,
        })
      );
      onInputImageListChange({ fileList: [] });
    }
  };

  const sendFile = () => {
    // Nếu đang uploading thì không gửi
    let uploading = false;
    inputMessage.files.forEach((item) => {
      if (item.status === "uploading") uploading = true;
    });
    if (uploading) return;
    if (inputMessage.files.length > 0) {
      // gửi file
      let files = [];
      inputMessage.files.forEach((item) => {
        if (item.response.name) {
          files.push(item.response);
        }
      });

      dispatch(
        actions.doCreateFiles({
          files,
          type: "file",
          receiver: record._id,
          conversationType: record.conversationType,
          isChatGroup,
          members,
        })
      );
      onInputFileListChange({ fileList: [] });
    }
  };

  const handleSendClick = () => {
    sendText();
    sendImage();
    sendFile();
    dispatch(actions.doToggleScrollToBottom());

    handleTypingOff();
    inputMessageRef.current.focus();
  };

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      e.preventDefault();
      handleSendClick();
    }
    if (!typing) {
      setTyping(true);
      if (record && !record.members) {
        if (inputMessage.text.trim() !== "") {
          emitTypingOn({
            info: currentUser,
            receiverId: record._id,
            //conversationType: record.conversationType,
          });
        }
      }
    }
    delay(() => {
      handleTypingOff();
      setTyping(false);
    }, 1000);
  };

  return (
    <>
      <div className="chat-footer p-3 bg-white">
        <Form
          className="d-flex align-items-center"
          action=""
          onKeyPress={handleKeyPress}
        >
          <div className="chat-attagement d-flex custom-file-button">
            <Upload
              accept="image/*"
              name="photos"
              multiple={true}
              fileList={inputMessage.images}
              headers={{
                Authorization: `Bearer ${isAuthenticated()}`,
                "x-access-token": isAuthenticated(),
              }}
              action={`${process.env.REACT_APP_API_URI}/message/photos`}
              showUploadList={false}
              onChange={(files) => {
                onInputImageListChange(files);
              }}
            >
              <i class="fa fa-image pe-3" aria-hidden="true"></i>
            </Upload>
            <Upload
              accept="text/plain, application/pdf, .csv, .docx, .xlsx"
              name="files"
              multiple={true}
              fileList={inputMessage.files}
              headers={{
                Authorization: `Bearer ${isAuthenticated()}`,
                "x-access-token": isAuthenticated(),
              }}
              action={`${process.env.REACT_APP_API_URI}/message/files`}
              showUploadList={false}
              onChange={(files) => {
                onInputFileListChange(files);
              }}
            >
              <i className="fa fa-paperclip pe-3" aria-hidden="true" suff></i>
              {/*  <i className="far fa-smile pe-3" aria-hidden="true"></i> */}
            </Upload>
            <Popover
              content={<Picker data={data} onEmojiSelect={addEmoji} />}
              title="Title"
              trigger="click"
              visible={emojiVisible}
              onVisibleChange={() => setEmojiVisible(!emojiVisible)}
            >
              <i
                className="far fa-smile pe-3"
                style={{
                  cursor: "pointer",
                  fontSize: "16px",
                  lineHeight: "36px",
                }}
                aria-hidden="true"
              ></i>
            </Popover>
          </div>
          <Form.Control
            type="text"
            className="me-3"
            placeholder="Type your message"
            value={inputMessage.text}
            ref={inputMessageRef}
            onChange={(e) => {
              onInputMessageChange(e.target.value);
            }}
            onKeyUp={handleKeyPress}
          />
          <Button
            variant="primary d-flex align-items-center px-2"
            onClick={handleSendClick}
          >
            <i className="far fa-paper-plane" aria-hidden="true"></i>
            <span className="d-none d-lg-block ms-1">Send</span>
          </Button>
        </Form>
      </div>
    </>
  );
}

export default ChatContentFooter;
