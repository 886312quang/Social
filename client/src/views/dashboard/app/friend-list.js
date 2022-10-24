import React, { useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import contactActions from "../../../store/_actions/contact";
import contactSelectors from "../../../store/_selectors/contact";

//profile-header
import ProfileHeader from "../../../components/profile-header";

// image
import img1 from "../../../assets/images/page-img/profile-bg2.jpg";
import img2 from "../../../assets/images/page-img/profile-bg1.jpg";
import img3 from "../../../assets/images/page-img/profile-bg3.jpg";
import img4 from "../../../assets/images/page-img/profile-bg4.jpg";
import img5 from "../../../assets/images/page-img/profile-bg5.jpg";
import img6 from "../../../assets/images/page-img/profile-bg6.jpg";
import img7 from "../../../assets/images/page-img/profile-bg7.jpg";
import img8 from "../../../assets/images/page-img/profile-bg8.jpg";
import img9 from "../../../assets/images/page-img/profile-bg9.jpg";
import user05 from "../../../assets/images/user/05.jpg";
import user06 from "../../../assets/images/user/06.jpg";
import user07 from "../../../assets/images/user/07.jpg";
import user08 from "../../../assets/images/user/08.jpg";
import user09 from "../../../assets/images/user/09.jpg";
import user10 from "../../../assets/images/user/10.jpg";
import user13 from "../../../assets/images/user/13.jpg";
import user14 from "../../../assets/images/user/14.jpg";
import user15 from "../../../assets/images/user/15.jpg";
import user16 from "../../../assets/images/user/16.jpg";
import user17 from "../../../assets/images/user/17.jpg";
import user18 from "../../../assets/images/user/18.jpg";
import user19 from "../../../assets/images/user/19.jpg";

const FriendList = () => {
  const dispatch = useDispatch();

  // friendlist
  const friendList = useSelector(contactSelectors.selectContacts);

  useEffect(() => {
    dispatch(contactActions.getContacts());
  }, []);

  return (
    <>
      <ProfileHeader title="Friend Lists" img={img3} />
      <div id="content-page" className="content-page">
        <Container>
          <Row>
            {friendList
              ? friendList.map((item, index) => (
                  <Col md={6}>
                    <Card className=" card-block card-stretch card-height">
                      <Card.Body className=" profile-page p-0">
                        <div className="profile-header-image">
                          <div className="cover-container">
                            <img
                              src={img2}
                              alt="profile-bg"
                              className="rounded img-fluid w-100"
                            />
                          </div>
                          <div className="profile-info p-4">
                            <div className="user-detail">
                              <div className="d-flex flex-wrap justify-content-between align-items-start">
                                <div className="profile-detail d-flex">
                                  <div className="profile-img pe-4">
                                    <Link
                                      to={
                                        item._id
                                          ? `/dashboard/app/friend-profile/${item._id}`
                                          : "#"
                                      }
                                    >
                                      <img
                                        src={
                                          item.avatar
                                            ? process.env
                                                .REACT_APP_STATIC_AVATARS +
                                              "/" +
                                              item.avatar
                                            : img5
                                        }
                                        alt="profile-img"
                                        className="avatar-130 img-fluid"
                                      />
                                    </Link>
                                  </div>
                                  <div className="user-data-block">
                                    <h4>
                                      <Link
                                        to={
                                          item._id
                                            ? `/dashboard/app/friend-profile/${item._id}`
                                            : "#"
                                        }
                                      >
                                        {item.userName ? item.userName : null}
                                      </Link>
                                    </h4>

                                    <h6>
                                      {item.about.job
                                        ? `@${item.about.job}`
                                        : null}
                                    </h6>
                                    <p>
                                      {item.about.address
                                        ? `${item.about.address}`
                                        : null}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              : null}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FriendList;
