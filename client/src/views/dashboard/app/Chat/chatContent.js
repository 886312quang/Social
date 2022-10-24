import React from "react";
import { useDispatch, useSelector } from "react-redux";
import selectors from "../../../../store/_selectors/message";
import userSelectors from "../../../../store/_selectors/user";
import actions from "../../../../store/_actions/message";
import constants from "../../../../constants/message";
import {
  Container,
  Row,
  Col,
  Form,
  Tab,
  Nav,
  Button,
  Tooltip,
  Spinner,
} from "react-bootstrap";
import Moment from "react-moment";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import InfiniteScroll from "react-infinite-scroller";
import TypingIndicator from "./TypingIndicator";

export default function ChatContent({ record }) {
  const dispatch = useDispatch();

  const typing = useSelector(selectors.selectTyping);
  const hasMoreConversation = useSelector(selectors.selectHasMoreConversation);
  const sending = useSelector(selectors.selectSending);
  const findLoading = useSelector(selectors.selectFindLoading);
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const isScrollToBottom = useSelector(selectors.selectScrollToBottom);

  const [imageViewModelVisible, setImageViewModelVisible] = useState(false);
  const [currentImageViewIndex, setCurrentImageViewIndex] = useState(0);

  const scrollRef = useRef(0);
  let { userId } = useParams();

  const getInfo = (id) => {
    let memberInfo;

    const members = record.members;
    memberInfo = members.filter((member) => member._id === id);

    return memberInfo[0];
  };

  const indexImage = (src) => {
    let image = [{ src: src }];
    return image;
  };

  const getFullName = (record) => {
    if ((record && record.userName) || (record && record.name))
      return record.userName || record.name;
    return "";
  };

  let bufferToBase64 = (bufferFrom) => {
    return Buffer.from(bufferFrom).toString("base64");
  };

  const renderConversation = (messages) => {
    if (!currentUser) return <span></span>;
    return messages?.map((message, index) => {
      if (message?.conversationType === "notification") {
        return (
          <div key={index} className="notification-message">
            <span>{message?.text}</span>
          </div>
        );
      }
      return (
        <div key={index}>
          <div style={{ width: 30, marginRight: "5px" }}>
            {currentUser &&
              message?.senderId !== currentUser?._id &&
              record && (
                <Tooltip
                  title={
                    message.conversationType === "group"
                      ? getFullName(getInfo(message.sender.id))
                      : getFullName(record)
                  }
                ></Tooltip>
              )}
          </div>
          <div
            key={index}
            className={`${
              message.senderId === currentUser._id
                ? "chat d-flex other-user"
                : "chat chat-left"
            }`}
          >
            {message.senderId === currentUser._id ? (
              // Nếu người gửi là user hiện tại
              <>
                <div className="chat-user">
                  <Link className="avatar m-0" to="">
                    <img
                      src={
                        currentUser
                          ? process.env.REACT_APP_STATIC_AVATARS +
                            "/" +
                            currentUser.avatar
                          : ""
                      }
                      alt="avatar"
                      className="avatar-35 "
                    />
                  </Link>
                  <span className="chat-time mt-1">
                    <Moment format="HH:mm">{message.createdAt}</Moment>
                  </span>
                </div>
                {message.messageType === "text" ? (
                  <div className={`chat-detail`}>
                    <div className="chat-message">{message.text}</div>
                  </div>
                ) : message.messageType === "image" &&
                  message.file.length > 0 ? (
                  <div>
                    <div className={`chat-detail`}>
                      {message.file.map((image, key) => (
                        <div
                          key={key}
                          /*  style={{
                              backgroundImage: `url(${process.env.REACT_APP_STATIC_PHOTOS}`,
                            }} */
                          className="photo"
                          onClick={() => {
                            setImageViewModelVisible(true);
                            setCurrentImageViewIndex(
                              indexImage(
                                `data: ${
                                  image.contentType
                                }; base64, ${bufferToBase64(image.data)}
                              `
                              )
                            );
                          }}
                        >
                          <img
                            className="photo"
                            src={`data: ${
                              image.contentType
                            }; base64, ${bufferToBase64(image.data)}
                            `}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : message.messageType === "file" ? (
                  <div className={`chat-detail`}>
                    {message.file.map((file, key) => (
                      <div key={key}>
                        <a
                          key={key}
                          target="_blank"
                          style={{
                            textDecoration: "underline",
                            color: "blue",
                            marginRight: "22px",
                          }}
                          href={`data: ${
                            file.contentType
                          }; base64, ${bufferToBase64(file.data)}
                          `}
                          download={`${file.fileName}`}
                        >
                          {file.fileName}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              // Nếu người gửi không phải là user hiện tại
              <>
                <div className="chat-user">
                  <Link className="avatar m-0" to="">
                    <img
                      src={
                        record
                          ? process.env.REACT_APP_STATIC_AVATARS +
                            "/" +
                            record.avatar
                          : ""
                      }
                      alt="avatar"
                      className="avatar-35 "
                    />
                  </Link>
                  <span className="chat-time mt-1">
                    <Moment format="HH:mm">{message.createdAt}</Moment>
                  </span>
                </div>
                {message.messageType === "text" ? (
                  <div className={`chat-detail`}>
                    {record.conversationType === "group" && (
                      <p
                        style={{
                          color: "#868686",
                          fontSize: "12px",
                        }}
                      >
                        <div>Group</div>
                      </p>
                    )}
                    <div className="chat-message">{message.text}</div>
                  </div>
                ) : message.messageType === "image" &&
                  message.file.length > 0 ? (
                  <div>
                    <div className={`chat-detail`}>
                      {message.file.map((image, key) => (
                        <div
                          key={key}
                          className="photoL"
                          onClick={() => {
                            setImageViewModelVisible(true);
                            setCurrentImageViewIndex(
                              indexImage(
                                `data: ${
                                  image.contentType
                                }; base64, ${bufferToBase64(image.data)}
                              `
                              )
                            );
                          }}
                        >
                          <img
                            className="photo"
                            src={`data: ${
                              image.contentType
                            }; base64, ${bufferToBase64(image.data)}
                            `}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : message.messageType === "file" ? (
                  <div className={`chat-detail`}>
                    {message.file.map((file, key) => (
                      <div key={key}>
                        <a
                          key={key}
                          target="_blank"
                          style={{
                            textDecoration: "underline",
                            color: "#34119f",
                            marginLeft: "22px",
                          }}
                          href={`data: ${
                            file.contentType
                          }; base64, ${bufferToBase64(file.data)}
                          `}
                          download={`${file.fileName}`}
                        >
                          {file.fileName}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      );
    });
  };

  const scrollToBottom = async () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      scrollRef.current.scrollTop = await (scrollRef.current.scrollHeight *
        100000);
    }
  };

  const loadMoreConversation = () => {
    if (record && record.messages && record.messages.length >= 30)
      dispatch(actions.readMore(record._id, record.messages.length));
  };

  const handleInfiniteOnLoad = () => {
    loadMoreConversation();
  };

  if (isScrollToBottom) {
    scrollToBottom();
    dispatch(actions.doToggleScrollToBottom());
  }
  useEffect(() => {
    scrollToBottom();
    dispatch(actions.doToggleScrollToBottom());
  }, [userId || isScrollToBottom]);

  const typIndicator = (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <div className="chat-user">
        <Link className="avatar m-0" to="">
          <img
            src={
              currentUser
                ? process.env.REACT_APP_STATIC_AVATARS +
                  "/" +
                  currentUser.avatar
                : ""
            }
            alt="avatar"
            className="avatar-35 "
          />
        </Link>
      </div>
      <div className={`chat d-flex other-user`}>
        <div>
          <TypingIndicator />
        </div>
      </div>
    </div>
  );

  return (
    <div className="chat-content scroller" ref={scrollRef}>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={handleInfiniteOnLoad}
        hasMore={!findLoading && hasMoreConversation}
        useWindow={false}
        isReverse={true}
      >
        <div style={{ textAlign: "center" }}>
          {findLoading && hasMoreConversation && (
            <Spinner
              role={findLoading && hasMoreConversation}
              animation="border"
            ></Spinner>
          )}
        </div>
        {renderConversation(record?.messages)}
        {typing && typing.status && typIndicator}
        <div
          style={{
            textAlign: "right",
            color: "#8d8d8d",
            fontSize: "12px",
          }}
        >
          {sending && <span>Sending...</span>}
        </div>
      </InfiniteScroll>
    </div>
  );
}
