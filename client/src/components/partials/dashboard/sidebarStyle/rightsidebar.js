import React, { useEffect } from "react";
import {
  Navbar,
  Dropdown,
  Nav,
  Form,
  Card,
  Image,
  Badge,
} from "react-bootstrap";
//image
import { useDispatch, useSelector } from "react-redux";

import selectors from "../../../../store/_selectors/message";
import userSelectors from "../../../../store/_selectors/user";
import actions from "../../../../store/_actions/message";
import constants from "../../../../constants/message";
import { Link } from "react-router-dom";
import classNames from 'classnames/bind';
let cx = classNames.bind();

const RightSidebar = () => {
  const dispatch = useDispatch();

  const messages = useSelector(selectors.selectMessages);
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const messageListLoading = useSelector(selectors.selectMessageListLoading);
  const hasMoreMessageList = useSelector(selectors.selectHasMoreMessageList);

  console.log(messages, "test");

  useEffect(() => {
    dispatch(actions.list());
  }, []);

  const minirightsidebar = () => {
    document.getElementById("rightSidebar").classList.toggle("right-sidebar");
    document.body.classList.toggle("right-sidebar-close");
  };
  return (
    <>
      <div className="right-sidebar-mini" id="rightSidebar">
        <div className="right-sidebar-panel p-0">
          <Card className="shadow-none">
            <Card.Body className="p-0">
              <div className="media-height p-3" data-scrollbar="init">
                {messages &&
                  messages.length > 0 &&
                  messages.map((item, index) => (
                    <Link
                      to={`/dashboard/app/chat/${item._id}`}
                      onClick={() => dispatch({ type: constants.CLICK_TARGET })}
                    >
                      <div
                        className="d-flex align-items-center mb-4 pointer iq-menu"
                        key={index}
                      >
                        <div className={cx(`iq-profile-avatar ${item?.online === true ? 'status-online' : 'status-away'}`)}>
                          <Image
                            className="rounded-circle avatar-50"
                            src={
                              item?.avatar &&
                              process.env.REACT_APP_STATIC_AVATARS +
                                "/" +
                                item.avatar
                            }
                            alt=""
                          />
                        </div>
                        <div className="ms-3">
                          <h6 className="mb-0">
                            {item?.userName || item?.name}
                          </h6>
                          <p className="mb-0">Just Now</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
              <div
                className="right-sidebar-toggle bg-primary text-white mt-3"
                onClick={minirightsidebar}
              >
                <i className="ri-arrow-left-line side-left-icon"></i>
                <i className="ri-arrow-right-line side-right-icon">
                  <span className="ms-3 d-inline-block">Close Menu</span>
                </i>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
