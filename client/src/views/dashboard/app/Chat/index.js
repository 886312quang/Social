import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Tab,
  Nav,
  Button,
  Tooltip,
} from "react-bootstrap";
import Card from "../../../../components/Card";


import { useDispatch, useSelector } from "react-redux";
import selectors from "../../../../store/_selectors/message";
import userSelectors from "../../../../store/_selectors/user";
import actions from "../../../../store/_actions/message";
import constants from "../../../../constants/message";

import ChatContent from "./chatContent";
import ImageUploadList from "./ImageUploadList";
import FileUploadList from "./FileUploadList";

import classNames from "classnames/bind";
import ChatContentFooter from "./chatFooter";
let cx = classNames.bind();

const Chat = () => {
  const dispatch = useDispatch();

  const [show, setShow] = useState("");
  const [show1, setShow1] = useState("");
  const record = useSelector(selectors.selectRecord);
  const typing = useSelector(selectors.selectTyping);
  const hasMoreConversation = useSelector(selectors.selectHasMoreConversation);
  const sending = useSelector(selectors.selectSending);
  const findLoading = useSelector(selectors.selectFindLoading);
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const target = useSelector(selectors.selectClickTarget);
  const inputMessage = useSelector(selectors.selectInputMessage);

  // Params
  let userId = useParams();
  let lengthObjUserId = Object.entries(userId).length;
  useEffect(() => {
    async function load(userId) {
      await dispatch(actions.list());
      if (lengthObjUserId > 0 && !target) {
        await dispatch({
          type: constants.TARGET_CONVERSATION,
          payload: userId,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (lengthObjUserId > 0 && target) {
      dispatch({ type: constants.TARGET_CONVERSATION, payload: userId });
      dispatch({ type: constants.CHANGE_CONVERSATION, payload: userId });
    }
  }, [userId]);

  console.log(record?.messages);

  // State
  const [imageViewModelVisible, setImageViewModelVisible] = useState(false);
  const [currentImageViewIndex, setCurrentImageViewIndex] = useState(0);

  const ChatSidebar = () => {
    document.getElementsByClassName("scroller")[0].classList.add("show");
  };
  const ChatSidebarClose = () => {
    document.getElementsByClassName("scroller")[0].classList.remove("show");
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

  useEffect(() => {
    async function load(userId) {
      await dispatch(actions.list());
      if (lengthObjUserId > 0 && !target) {
        await dispatch({
          type: constants.TARGET_CONVERSATION,
          payload: userId,
        });
      }
    }

    load(userId);
  }, []);

  console.log(record);

  return (
    <>
      <Container>
        <Tab.Container id="left-tabs-example" defaultActiveKey="start">
          <Row>
            <Col sm="12">
              <Card>
                <Card.Body className="chat-page p-0">
                  <div className="chat-data-block">
                    <Row>
                      <Col lg={12} className=" chat-data p-0 chat-data-right">
                        <div className="chat-head">
                          <header className="d-flex justify-content-between align-items-center bg-white pt-3 pe-3 pb-3">
                            <div className="d-flex align-items-center">
                              <div className="sidebar-toggle">
                                <i className="ri-menu-3-line"></i>
                              </div>
                              <div className="avatar chat-user-profile m-0 me-3 pl-5">
                                <img
                                  src={
                                    record
                                      ? process.env.REACT_APP_STATIC_AVATARS +
                                        "/" +
                                        record.avatar
                                      : ""
                                  }
                                  alt="avatar"
                                  className="avatar-50 "
                                />
                              </div>
                              <h5 className="mb-0">
                                {record?.userName || record?.name}{" "}
                              </h5>
                            </div>
                            <div className="chat-user-detail-popup scroller">
                              <div className="user-profile">
                                <Button
                                  type="submit"
                                  variant=" close-popup p-3"
                                >
                                  <i className="ri-close-fill"></i>
                                </Button>
                                <div className="user mb-4  text-center">
                                  <Link className="avatar m-0" to="">
                                    <img src={""} alt="avatar" />
                                  </Link>
                                  <div className="user-name mt-4">
                                    <h4>Bni Jordan</h4>
                                  </div>
                                  <div className="user-desc">
                                    <p>Cape Town, RSA</p>
                                  </div>
                                </div>
                                <hr />
                                <div className="chatuser-detail text-left mt-4">
                                  <Row>
                                    <Col md="6" className="col-6  title">
                                      Bni Name:
                                    </Col>
                                    <Col md="6" className="col-6  text-right">
                                      Bni
                                    </Col>
                                  </Row>
                                  <hr />
                                  <Row>
                                    <Col md="6" className="col-6 title">
                                      Tel:
                                    </Col>
                                    <Col md="6" className="col-6 text-right">
                                      072 143 9920
                                    </Col>
                                  </Row>
                                  <hr />
                                  <Row>
                                    <Col md="6" className="col-6 title">
                                      Date Of Birth:
                                    </Col>
                                    <Col md="6" className="col-6 text-right">
                                      July 12, 1989
                                    </Col>
                                  </Row>
                                  <hr />
                                  <Row>
                                    <Col md="6" className="col-6 title">
                                      Gender:
                                    </Col>
                                    <Col md="6" className="col-6 text-right">
                                      Male
                                    </Col>
                                  </Row>
                                  <hr />
                                  <Row>
                                    <Col md="6" className="col-6 title">
                                      Language:
                                    </Col>
                                    <Col md="6" className="col-6 text-right">
                                      Engliah
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                            <div className="chat-header-icons d-flex">
                              <Link
                                to="#"
                                className="chat-icon-phone bg-soft-primary"
                              >
                                <i className="ri-phone-line"></i>
                              </Link>
                              <Link
                                to="#"
                                className="chat-icon-video bg-soft-primary"
                              >
                                <i className="ri-vidicon-line"></i>
                              </Link>
                              <Link
                                to="#"
                                className="chat-icon-delete bg-soft-primary"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </Link>
                              <span className="dropdown bg-soft-primary">
                                <i
                                  className="ri-more-2-line cursor-pointer dropdown-toggle nav-hide-arrow cursor-pointer pe-0"
                                  id="dropdownMenuButton02"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                ></i>
                                <span
                                  className="dropdown-menu dropdown-menu-right"
                                  aria-labelledby="dropdownMenuButton02"
                                >
                                  <Link className="dropdown-item" to="#">
                                    <i className="ri-pushpin-2-line me-1 h5"></i>
                                    Pin to top
                                  </Link>
                                  <Link className="dropdown-item" to="#">
                                    <i className="ri-delete-bin-6-line me-1 h5"></i>
                                    Delete chat
                                  </Link>
                                  <Link className="dropdown-item" to="#">
                                    <i className="ri-time-line me-1 h5"></i>
                                    Block
                                  </Link>
                                </span>
                              </span>
                            </div>
                          </header>
                        </div>
                        <ChatContent record={record} />
                        {inputMessage && inputMessage.images.length > 0 && (
                          <ImageUploadList
                            fileList={inputMessage.images}
                            onDelete={(fileList) =>
                              onInputImageListChange({ fileList })
                            }
                          />
                        )}
                        {inputMessage && inputMessage.files.length > 0 && (
                          <FileUploadList
                            onDelete={(fileList) =>
                              onInputFileListChange({ fileList })
                            }
                            fileList={inputMessage.files}
                          />
                        )}
                        <ChatContentFooter />
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  );
};
export default Chat;
