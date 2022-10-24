import React, { useState, useEffect } from "react";
import {
  Navbar,
  Dropdown,
  Nav,
  Form,
  Card,
  Image,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import actions from "../../../../store/_actions/auth";
import contactActions from "../../../../store/_actions/contact";
import userActions from "../../../../store/_actions/user";
import notifyActions from "../../../../store/_actions/notificaions";
import contactSelectors from "../../../../store/_selectors/contact";
import userSelectors from "../../../../store/_selectors/user";
import notifySelectors from "../../../../store/_selectors/notifications";
import * as constants from "../../../../constants/auth";
import useSearch from "../../../../hooks/useSearch";
import { formatDistanceToNowStrict } from "date-fns";

//image
import logo from "../../../../assets/images/logo.png";
import Button from "@restart/ui/esm/Button";

const Header = () => {
  const dispatch = useDispatch();

  // Search
  const { data, setData } = useSearch();
  const [focus, setFocus] = useState(false);

  // User
  const users = useSelector(userSelectors.selectUsers);
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  
  console.log(currentUser)

  // Notify
  const notify = useSelector(notifySelectors.selectNotifys);
  const countNotify = useSelector(notifySelectors.selectCountNotify);

  // Contact
  const countContactSent = useSelector(contactSelectors.selectCountSent);
  const countContactReceived = useSelector(
    contactSelectors.selectCountReceived
  );
  const requestFriends = useSelector(contactSelectors.selectRequests);

  const minisidebar = () => {
    document.body.classList.toggle("sidebar-main");
  };

  const onFocus = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  const doSignout = () => {
    dispatch(actions.doSignOut());
  };

  const handleAddContact = (userInfo) => {
    dispatch(contactActions.doCreate(userInfo));
  };
  const handleRemoveSentRequestContact = (userInfo) => {
    dispatch(contactActions.removeSentRequestContact(userInfo._id));
  };

  const handleRemoveContactRequest = (userInfo) => {
    dispatch(contactActions.removeRequestContact(userInfo._id));
  };

  const handleAcceptContactRequest = (userInfo) => {
    dispatch(contactActions.acceptContact(userInfo._id));
  };

  const handleMarkNotify = (id, isRead) => {
    if (!isRead) {
      dispatch(notifyActions.markNotify(id));
    }
  };

  useEffect(() => {
    if (!currentUser) {
      dispatch(userActions.getCurrentUser());
    }
    dispatch(contactActions.getContacts());
    dispatch(notifyActions.getNotifications());
  }, []);

  return (
    <>
      <div className="iq-top-navbar">
        <div className="iq-navbar-custom">
          <Navbar expand="lg" variant="light" className="p-0">
            <div className="iq-navbar-logo d-flex justify-content-between">
              <Link to="/">
                <Image src={logo} className="img-fluid" alt="" />
                <span>SocialV</span>
              </Link>
              <div className="iq-menu-bt align-self-center">
                <div className="wrapper-menu" onClick={minisidebar}>
                  <div className="main-circle">
                    <i className="ri-menu-line"></i>
                  </div>
                </div>
              </div>
            </div>
            {/* Search */}
            <Navbar.Collapse>
              <Nav as="ul" className="navbar-list">
                <Dropdown as="li" className="nav-item">
                  <Dropdown.Toggle href="#" variant="search-toggle">
                    <div className="iq-search-bar device-search">
                      <Form action="#" className="searchbox">
                        <input
                          type="text"
                          className="text search-input"
                          placeholder="Search here..."
                          style={{ fontSize: "14px" }}
                          onChange={(e) =>
                            setData({ ...data, slug: e.target.value })
                          }
                          onFocus={onFocus}
                          onBlur={onBlur}
                        />
                      </Form>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className={`sub-drop sub-drop-large ${
                      focus ? "show" : null
                    }`}
                    aria-labelledby="group-drop"
                  >
                    <Card className="shadow-1 m-0">
                      <Card.Body className="p-0">
                        {users.length > 0
                          ? users.slice(0, 5).map((item, index) => (
                              <div className="iq-friend-request" key={index}>
                                <div className="iq-sub-card iq-sub-card-big d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center">
                                    <Link
                                      to={
                                        item._id
                                          ? `/dashboard/app/profile/${item._id}`
                                          : "#"
                                      }
                                    >
                                      <Image
                                        className="avatar-40 rounded"
                                        src={
                                          item.avatar &&
                                          process.env.REACT_APP_STATIC_AVATARS +
                                            "/" +
                                            item.avatar
                                        }
                                        alt=""
                                      />
                                    </Link>
                                    <Link
                                      to={
                                        item._id
                                          ? `/dashboard/app/profile/${item._id}`
                                          : "#"
                                      }
                                    >
                                      <div className="ms-3">
                                        <h6 className="mb-0 ">
                                          {item.userName}
                                        </h6>
                                        <p className="mb-0">40 friends</p>
                                      </div>
                                    </Link>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    {item.status === true ? (
                                      <Button
                                        onClick={() =>
                                          handleRemoveSentRequestContact(item)
                                        }
                                        className="me-3 btn btn-danger rounded"
                                      >
                                        Cancel Request
                                      </Button>
                                    ) : (
                                      <Button
                                        onClick={() => handleAddContact(item)}
                                        className="me-3 btn btn-primary rounded"
                                      >
                                        Add Friend
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          : null}

                        <div className="text-center">
                          <Link to="#" className=" btn text-primary">
                            <i
                              class="fas fa-search"
                              style={{ paddingRight: "6px" }}
                            ></i>
                            Search {`${data.slug}`}
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>

            {/* Menu */}
            <Navbar.Toggle as="button">
              <i className="ri-menu-3-line"></i>
            </Navbar.Toggle>
            <Navbar.Collapse>
              <Nav as="ul" className="ms-auto navbar-list">
                {/* Home */}
                <Dropdown as="li" className="nav-item">
                  <Dropdown.Toggle
                    href="/"
                    as={Button}
                    className="d-flex align-items-center"
                    variant="search-toggle"
                  >
                    <i className="ri-home-line"></i>
                  </Dropdown.Toggle>
                </Dropdown>
                {/* Friend Requests */}
                <Dropdown as="li" className="nav-item">
                  <Dropdown.Toggle href="#" as={Button} variant="search-toggle">
                    <div className="position-relative">
                      <i className="ri-group-line"></i>
                      {countContactReceived > 0 ? (
                        <Badge
                          pill
                          bg="danger"
                          className="position-absolute"
                          style={{
                            lineHeight: "10px",
                            top: "15px",
                            left: "10px",
                          }}
                        >
                          {countContactReceived}
                        </Badge>
                      ) : null}
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="sub-drop sub-drop-large"
                    aria-labelledby="group-drop"
                  >
                    <Card className="shadow-1 m-0">
                      <Card.Header className="d-flex justify-content-between bg-primary">
                        <div className="header-title">
                          <h5 className="mb-0 text-white">Friend Request</h5>
                        </div>
                        <small className="badge bg-light text-dark ">
                          {countContactReceived}
                        </small>
                      </Card.Header>
                      <Card.Body className="p-0">
                        {requestFriends.length > 0 ? (
                          requestFriends.slice(0, 5).map((item, index) => (
                            <div className="iq-friend-request" key={index}>
                              <div className="iq-sub-card iq-sub-card-big d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <Image
                                    className="avatar-40 rounded"
                                    src={
                                      process.env.REACT_APP_STATIC_AVATARS +
                                      "/" +
                                      item.avatar
                                    }
                                    alt=""
                                  />
                                  <div className="ms-3">
                                    <h6 className="mb-0 ">{item.userName}</h6>
                                    <p className="mb-0">40 friends</p>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center">
                                  <Button
                                    className="me-3 btn btn-primary rounded"
                                    onClick={() =>
                                      handleAcceptContactRequest(item)
                                    }
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    className="me-3 btn btn-secondary rounded"
                                    onClick={() =>
                                      handleRemoveContactRequest(item)
                                    }
                                  >
                                    Delete Request
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center">No more request</div>
                        )}
                        {countContactReceived > 5 ? (
                          <div className="text-center">
                            <Link to="#" className=" btn text-primary">
                              View More Request
                            </Link>
                          </div>
                        ) : null}
                      </Card.Body>
                    </Card>
                  </Dropdown.Menu>
                </Dropdown>
                {/* Notifications */}
                <Dropdown as="li" className="nav-item">
                  <Dropdown.Toggle href="#" as={Button} variant="search-toggle">
                    <div className="position-relative">
                      <i className="ri-notification-4-line"></i>
                      {countNotify > 0 ? (
                        <Badge
                          pill
                          bg="danger"
                          className="position-absolute"
                          style={{
                            lineHeight: "10px",
                            top: "15px",
                            left: "10px",
                          }}
                        >
                          {countNotify}
                        </Badge>
                      ) : null}
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="sub-drop"
                    aria-labelledby="group-drop"
                  >
                    <Card className="shadow-1 m-0">
                      <Card.Header className="d-flex justify-content-between bg-primary">
                        <div className="header-title bg-primary">
                          <Link to="/dashboard/app/notification">
                            <h5 className="mb-0 text-white">
                              All Notifications
                            </h5>
                          </Link>
                        </div>
                        <small className="badge bg-light text-dark">
                          {countNotify ? countNotify : 0}
                        </small>
                      </Card.Header>
                      <Card.Body className="p-0">
                        {notify.length > 0 ? (
                          notify.slice(0, 5).map((item, index) => (
                            <Link
                              to={
                                item.link ? `/dashboard/app/${item.link}` : "#"
                              }
                              className="iq-sub-card d-flex align-items-center justify-content-between"
                              key={index}
                              onClick={() =>
                                handleMarkNotify(item.id, item.isRead)
                              }
                            >
                              <div className="d-flex align-items-center">
                                <Image
                                  className="avatar-40 rounded"
                                  src={
                                    item.avatar &&
                                    process.env.REACT_APP_STATIC_AVATARS +
                                      "/" +
                                      item.avatar
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="ms-3 w-100">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
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
                                    <div className="d-flex justify-content-between align-items-center">
                                      <small className="float-right font-size-12">
                                        {item.createdAt && item.createdAt
                                          ? formatDistanceToNowStrict(
                                              new Date(item.createdAt),
                                              {
                                                addSuffix: false,
                                              }
                                            )
                                          : ""}
                                      </small>
                                    </div>
                                  </div>
                                  {!item.isRead ? (
                                    <div className="iq-notify status-online"></div>
                                  ) : null}
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="text-center">No more notify</div>
                        )}
                        {countNotify > 5 ? (
                          <div className="text-center">
                            <Link to="#" className=" btn text-primary">
                              View More Notify
                            </Link>
                          </div>
                        ) : null}
                      </Card.Body>
                    </Card>
                  </Dropdown.Menu>
                </Dropdown>
                {/* Info */}
                <Dropdown as="li" className="nav-item">
                  <Dropdown.Toggle
                    href="#"
                    as={Button}
                    bsPrefix="d-flex align-items-center search-toggle"
                  >
                    <Image
                      src={
                        currentUser &&
                        process.env.REACT_APP_STATIC_AVATARS +
                          "/" +
                          currentUser.avatar
                      }
                      className="img-fluid rounded-circle me-3"
                      alt="user"
                    />
                    <div className="caption">
                      <h6 className="mb-0 line-height">
                        {currentUser &&
                          currentUser.userName &&
                          currentUser.userName}
                      </h6>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="sub-drop dropdown-menu caption-menu"
                    aria-labelledby="drop-down-arrow"
                  >
                    <Card className="shadow-1 m-0">
                      <Card.Header className="bg-primary">
                        <div className="header-title">
                          <h5 className="mb-0 text-white">
                            {currentUser &&
                              currentUser.userName &&
                              currentUser.userName}
                          </h5>
                          <span className="text-white font-size-12">
                            Available
                          </span>
                        </div>
                      </Card.Header>
                      <Card.Body className="p-0 ">
                        <Link
                          to={`/dashboard/app/profile/${
                            currentUser ? currentUser._id : null
                          }`}
                          className="iq-sub-card iq-bg-primary-hover d-flex align-items-center justify-content-between"
                        >
                          <div className="d-flex align-items-center">
                            <div className="rounded card-icon bg-soft-primary">
                              <i className="ri-file-user-line"></i>
                            </div>
                            <div className="ms-3">
                              <h6 className="mb-0 ">My Profile</h6>
                              <p className="mb-0 font-size-12">
                                View personal profile details.
                              </p>
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/dashboard/app/user-profile-edit"
                          className="iq-sub-card iq-bg-warning-hover d-flex align-items-center justify-content-between"
                        >
                          <div className="d-flex align-items-center">
                            <div className="rounded card-icon bg-soft-warning">
                              <i className="ri-profile-line"></i>
                            </div>
                            <div className="ms-3">
                              <h6 className="mb-0 ">Edit Profile</h6>
                              <p className="mb-0 font-size-12">
                                Modify your personal details.
                              </p>
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/dashboard/app/user-account-setting"
                          className="iq-sub-card iq-bg-info-hover d-flex align-items-center justify-content-between"
                        >
                          <div className="d-flex align-items-center">
                            <div className="rounded card-icon bg-soft-info">
                              <i className="ri-account-box-line"></i>
                            </div>
                            <div className="ms-3">
                              <h6 className="mb-0 ">Account settings</h6>
                              <p className="mb-0 font-size-12">
                                Manage your account parameters.
                              </p>
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/dashboard/app/user-privacy-setting"
                          className="iq-sub-card iq-bg-danger-hover d-flex align-items-center justify-content-between"
                        >
                          <div className="d-flex align-items-center">
                            <div className="rounded card-icon bg-soft-danger">
                              <i className="ri-lock-line"></i>
                            </div>
                            <div className="ms-3">
                              <h6 className="mb-0 ">Privacy Settings</h6>
                              <p className="mb-0 font-size-12">
                                Control your privacy parameters.
                              </p>
                            </div>
                          </div>
                        </Link>
                        <div className="d-inline-block w-100 text-center p-3">
                          <Link
                            className="btn btn-primary iq-sign-btn"
                            to="/auth/sign-in"
                            role="button"
                            onClick={doSignout}
                          >
                            Sign out
                            <i className="ri-login-box-line ms-2"></i>
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </div>
    </>
  );
};

export default Header;
