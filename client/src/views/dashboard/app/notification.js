import React from "react";
import { Row, Col, Container, Dropdown } from "react-bootstrap";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import actions from "../../../store/_actions/auth";
import contactActions from "../../../store/_actions/contact";
import userActions from "../../../store/_actions/user";
import notifyActions from "../../../store/_actions/notificaions";
import contactSelectors from "../../../store/_selectors/contact";
import userSelectors from "../../../store/_selectors/user";
import notifySelectors from "../../../store/_selectors/notifications";
import { formatDistanceToNowStrict } from "date-fns";

const Notification = () => {
  const dispatch = useDispatch();

  // Notify
  const notify = useSelector(notifySelectors.selectNotifys);
  const countNotify = useSelector(notifySelectors.selectCountNotify);

  const handleMarkNotify = (id, isRead) => {
    if (!isRead) {
      dispatch(notifyActions.markNotify(id));
    }
  };

  const renderIcon = (type) => {
    if (type === "add_contact")
      return (
        <div className="me-3 iq-notification bg-soft-danger rounded">
          <i className="ri-reply-line"></i>
        </div>
      );
    else if (type === "accept_contact")
      return (
        <div className="me-3 iq-notification bg-soft-primary rounded">
          <i className="ri-reply-line"></i>
        </div>
      );
    else if (type === "comment_post")
      return (
        <div className="me-3 iq-notification bg-soft-primary rounded">
          <i className="ri-chat-4-line"></i>
        </div>
      );
    else if (type === "likes_post")
      return (
        <div className="me-3 iq-notification bg-soft-danger rounded">
          <i className="ri-heart-line"></i>
        </div>
      );
  };

  return (
    <>
      <Container>
        <Row>
          <Col sm="12">
            <h4 className="card-title">Notification</h4>
          </Col>
          <Col sm="12">
            {notify.length > 0
              ? notify.slice(0, 10).map((item, index) => (
                  <Link
                    to={item.link ? `/dashboard/app/${item.link}` : "#"}
                    onClick={() => handleMarkNotify(item.id, item.isRead)}
                  >
                    <Card>
                      <Card.Body key={index}>
                        <ul className="notification-list m-0 p-0">
                          <li className="d-flex align-items-center justify-content-between">
                            <div className="user-img img-fluid">
                              <img
                                src={
                                  item.avatar &&
                                  process.env.REACT_APP_STATIC_AVATARS +
                                    "/" +
                                    item.avatar
                                }
                                alt="story-img"
                                className="rounded-circle avatar-40"
                              />
                            </div>
                            <div className="w-100">
                              <div className="d-flex justify-content-between">
                                <div className=" ms-3">
                                  <h6
                                    className={`mb-0 text-notify ${
                                      !item.isRead ? "isRead" : null
                                    }`}
                                  >
                                    <strong>
                                      {item.userName && item.userName}{" "}
                                    </strong>
                                    {item.content && item.content}
                                  </h6>
                                  <p
                                    className={`mb-0 ${
                                      item.isRead ? "text-notify isRead" : null
                                    }`}
                                  >
                                    {item.createdAt && item.createdAt
                                      ? formatDistanceToNowStrict(
                                          new Date(item.createdAt),
                                          {
                                            addSuffix: false,
                                          }
                                        )
                                      : ""}
                                  </p>
                                </div>
                                <div className="d-flex align-items-center">
                                  {renderIcon(item.type)}
                                  {/*  <i className="ri-award-line"></i> */}
                                  {/* <i className="ri-heart-line"></i>
                                  <i className="ri-chat-4-line"></i>
                                  <i className="ri-reply-line"></i>
                                  <i className="ri-share-line"></i>
                                  <i className="las la-birthday-cake"></i> */}
                                  <div className="card-header-toolbar d-flex align-items-center">
                                    <Dropdown>
                                      <Dropdown.Toggle
                                        as="span"
                                        className="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                      >
                                        <i className="ri-more-fill h4"></i>
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu className="dropdown-menu-right">
                                        <Dropdown.Item to="#">
                                          <i className="ri-eye-fill me-2"></i>
                                          Đánh dấu đã đọc
                                        </Dropdown.Item>
                                        <Dropdown.Item to="#">
                                          <i className="ri-delete-bin-6-fill me-2"></i>
                                          Gỡ thông báo
                                        </Dropdown.Item>
                                        <Dropdown.Item to="#">
                                          <i className="ri-pencil-fill me-2"></i>
                                          Báo cáo
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </Card.Body>
                    </Card>
                  </Link>
                ))
              : null}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Notification;
