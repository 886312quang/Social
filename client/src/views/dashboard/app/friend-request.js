import React, { useState, useEffect } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import actions from "../../../store/_actions/auth";
import contactActions from "../../../store/_actions/contact";
import userActions from "../../../store/_actions/user";
import userSelectors from "../../../store/_selectors/user";
import contactSelectors from "../../../store/_selectors/contact";

// img

import user5 from "../../../assets/images/user/05.jpg";
import user6 from "../../../assets/images/user/06.jpg";
import user7 from "../../../assets/images/user/07.jpg";
import user8 from "../../../assets/images/user/08.jpg";
import user9 from "../../../assets/images/user/09.jpg";
import user10 from "../../../assets/images/user/10.jpg";
import user11 from "../../../assets/images/user/11.jpg";
import user12 from "../../../assets/images/user/12.jpg";
import user13 from "../../../assets/images/user/13.jpg";
import user14 from "../../../assets/images/user/14.jpg";
import user15 from "../../../assets/images/user/15.jpg";
import user16 from "../../../assets/images/user/16.jpg";
import user17 from "../../../assets/images/user/17.jpg";
//Sweet alert
import Swal from "sweetalert2";

const FriendReqest = () => {
  const dispatch = useDispatch();

  // Contact
  const countContactSent = useSelector(contactSelectors.selectCountSent);
  const countContactReceived = useSelector(
    contactSelectors.selectCountReceived
  );
  const requestFriends = useSelector(contactSelectors.selectRequests);

  const handleRemoveContactRequest = (userInfo) => {
    dispatch(contactActions.removeRequestContact(userInfo._id));
  };

  const handleAcceptContactRequest = (userInfo) => {
    dispatch(contactActions.acceptContact(userInfo._id));
  };

  const questionAlert = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-outline-primary btn-lg ms-2",
        confirmButton: "btn btn-primary btn-lg",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "cancel",
        confirmButtonText: "Yes, delete it!",

        reverseButtons: false,
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your Request has been deleted.",
            icon: "success",
            showClass: {
              popup: "animate__animated animate__zoomIn",
            },
            hideClass: {
              popup: "animate__animated animate__zoomOut",
            },
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Your Request is safe!",
            showClass: {
              popup: "animate__animated animate__zoomIn",
            },
            hideClass: {
              popup: "animate__animated animate__zoomOut",
            },
          });
        }
      });
  };

  useEffect(() => {
    dispatch(contactActions.getContacts());
  }, []);

  return (
    <>
      <Container>
        <Row>
          <Col sm="12">
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Friend Request</h4>
                </div>
              </Card.Header>
              <Card.Body>
                <ul className="request-list list-inline m-0 p-0">
                  {requestFriends.length > 0 ? (
                    requestFriends.slice(0, 10).map((item, index) => (
                      <li
                        className="d-flex align-items-center  justify-content-between flex-wrap"
                        key={index}
                      >
                        <div className="user-img img-fluid flex-shrink-0">
                          <img
                            src={
                              process.env.REACT_APP_STATIC_AVATARS +
                              "/" +
                              item.avatar
                            }
                            alt="story-img"
                            className="rounded-circle avatar-40"
                          />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6>{item.userName ? item.userName : null}</h6>
                          <p className="mb-0">40 friends</p>
                        </div>
                        <div className="d-flex align-items-center mt-2 mt-md-0">
                          <div className="confirm-click-btn">
                            <Button
                              className="me-3 btn btn-primary rounded confirm-btn"
                              onClick={() => handleAcceptContactRequest(item)}
                            >
                              Confirm
                            </Button>
                          </div>
                          <Button
                            onClick={() => handleRemoveContactRequest(item)}
                            className="btn btn-secondary rounded"
                            data-extra-toggle="delete"
                            data-closest-elem=".item"
                          >
                            Delete Request
                          </Button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="d-block text-center mb-0 pb-0">
                      <Link to="#" className="me-3 btn">
                        No More Friend Request
                      </Link>
                    </li>
                  )}
                  {requestFriends.length > 10 ? (
                    <li className="d-block text-center mb-0 pb-0">
                      <Link to="#" className="me-3 btn">
                        View More Request
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">People You May Know</h4>
                </div>
              </Card.Header>
              <Card.Body>
                <ul className="request-list m-0 p-0">
                  <li className="d-flex align-items-center  flex-wrap">
                    <div className="user-img img-fluid flex-shrink-0">
                      <img
                        src={user15}
                        alt="story-img"
                        className="rounded-circle avatar-40"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6>Jen Youfelct</h6>
                      <p className="mb-0">4 friends</p>
                    </div>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <Link to="#" className="me-3 btn btn-primary rounded">
                        <i className="ri-user-add-line me-1"></i>Add Friend
                      </Link>
                      <Link
                        to="#"
                        onClick={questionAlert}
                        className="btn btn-secondary rounded"
                        data-extra-toggle="delete"
                        data-closest-elem=".item"
                      >
                        Remove
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center flex-wrap">
                    <div className="user-img img-fluid flex-shrink-0">
                      <img
                        src={user16}
                        alt="story-img"
                        className="rounded-circle avatar-40"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6>Cooke Edoh</h6>
                      <p className="mb-0">20 friends</p>
                    </div>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <Link to="#" className="me-3 btn btn-primary rounded">
                        <i className="ri-user-add-line me-1"></i>Add Friend
                      </Link>
                      <Link
                        to="#"
                        onClick={questionAlert}
                        className="btn btn-secondary rounded"
                        data-extra-toggle="delete"
                        data-closest-elem=".item"
                      >
                        Remove
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center flex-wrap">
                    <div className="user-img img-fluid flex-shrink-0">
                      <img
                        src={user17}
                        alt="story-img"
                        className="rounded-circle avatar-40"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6>Earl E. Riser</h6>
                      <p className="mb-0">30 friends</p>
                    </div>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <Link to="#" className="me-3 btn btn-primary rounded">
                        <i className="ri-user-add-line me-1"></i>Add Friend
                      </Link>
                      <Link
                        to="#"
                        onClick={questionAlert}
                        className="btn btn-secondary rounded"
                        data-extra-toggle="delete"
                        data-closest-elem=".item"
                      >
                        Remove
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center flex-wrap">
                    <div className="user-img img-fluid flex-shrink-0">
                      <img
                        src={user5}
                        alt="story-img"
                        className="rounded-circle avatar-40"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6>Cliff Diver</h6>
                      <p className="mb-0">5 friends</p>
                    </div>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <Link to="#" className="me-3 btn btn-primary rounded">
                        <i className="ri-user-add-line me-1"></i>Add Friend
                      </Link>
                      <Link
                        to="#"
                        onClick={questionAlert}
                        className="btn btn-secondary rounded"
                        data-extra-toggle="delete"
                        data-closest-elem=".item"
                      >
                        Remove
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center flex-wrap">
                    <div className="user-img img-fluid flex-shrink-0">
                      <img
                        src={user6}
                        alt="story-img"
                        className="rounded-circle avatar-40"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6>Cliff Diver</h6>
                      <p className="mb-0">5 friends</p>
                    </div>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <Link to="#" className="me-3 btn btn-primary rounded">
                        <i className="ri-user-add-line me-1"></i>Add Friend
                      </Link>
                      <Link
                        to="#"
                        onClick={questionAlert}
                        className="btn btn-secondary rounded"
                        data-extra-toggle="delete"
                        data-closest-elem=".item"
                      >
                        Remove
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center flex-wrap">
                    <div className="user-img img-fluid flex-shrink-0">
                      <img
                        src={user7}
                        alt="story-img"
                        className="rounded-circle avatar-40"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6>Vinny Gret</h6>
                      <p className="mb-0">50 friends</p>
                    </div>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <Link to="#" className="me-3 btn btn-primary rounded">
                        <i className="ri-user-add-line me-1"></i>Add Friend
                      </Link>
                      <Link
                        to="#"
                        onClick={questionAlert}
                        className="btn btn-secondary rounded"
                        data-extra-toggle="delete"
                        data-closest-elem=".item"
                      >
                        Remove
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center flex-wrap">
                    <div className="user-img img-fluid flex-shrink-0">
                      <img
                        src={user8}
                        alt="story-img"
                        className="rounded-circle avatar-40"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6>Paul Samic</h6>
                      <p className="mb-0">6 friends</p>
                    </div>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <Link to="#" className="me-3 btn btn-primary rounded">
                        <i className="ri-user-add-line me-1"></i>Add Friend
                      </Link>
                      <Link
                        to="#"
                        onClick={questionAlert}
                        className="btn btn-secondary rounded"
                        data-extra-toggle="delete"
                        data-closest-elem=".item"
                      >
                        Remove
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center flex-wrap">
                    <div className="user-img img-fluid flex-shrink-0">
                      <img
                        src={user9}
                        alt="story-img"
                        className="rounded-circle avatar-40"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6>Gustav Wind</h6>
                      <p className="mb-0">14 friends</p>
                    </div>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <Link to="#" className="me-3 btn btn-primary rounded">
                        <i className="ri-user-add-line me-1"></i>Add Friend
                      </Link>
                      <Link
                        to="#"
                        onClick={questionAlert}
                        className="btn btn-secondary rounded"
                        data-extra-toggle="delete"
                        data-closest-elem=".item"
                      >
                        Remove
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center flex-wrap">
                    <div className="user-img img-fluid flex-shrink-0">
                      <img
                        src={user10}
                        alt="story-img"
                        className="rounded-circle avatar-40"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6>Minnie Strone</h6>
                      <p className="mb-0">16 friends</p>
                    </div>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <Link to="#" className="me-3 btn btn-primary rounded">
                        <i className="ri-user-add-line me-1"></i>Add Friend
                      </Link>
                      <Link
                        to="#"
                        onClick={questionAlert}
                        className="btn btn-secondary rounded"
                        data-extra-toggle="delete"
                        data-closest-elem=".item"
                      >
                        Remove
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center flex-wrap">
                    <div className="user-img img-fluid flex-shrink-0">
                      <img
                        src={user11}
                        alt="story-img"
                        className="rounded-circle avatar-40"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6>Ray Volver</h6>
                      <p className="mb-0">9 friends</p>
                    </div>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <Link to="#" className="me-3 btn btn-primary rounded">
                        <i className="ri-user-add-line me-1"></i>Add Friend
                      </Link>
                      <Link
                        to="#"
                        onClick={questionAlert}
                        className="btn btn-secondary rounded"
                        data-extra-toggle="delete"
                        data-closest-elem=".item"
                      >
                        Remove
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center flex-wrap">
                    <div className="user-img img-fluid flex-shrink-0">
                      <img
                        src={user12}
                        alt="story-img"
                        className="rounded-circle avatar-40"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6>Indy Nile</h6>
                      <p className="mb-0">6 friends</p>
                    </div>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <Link to="#" className="me-3 btn btn-primary rounded">
                        <i className="ri-user-add-line me-1"></i>Add Friend
                      </Link>
                      <Link
                        to="#"
                        onClick={questionAlert}
                        className="btn btn-secondary rounded"
                        data-extra-toggle="delete"
                        data-closest-elem=".item"
                      >
                        Remove
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center mb-0 pb-0  flex-wrap">
                    <div className="user-img img-fluid flex-shrink-0">
                      <img
                        src={user13}
                        alt="story-img"
                        className="rounded-circle avatar-40"
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6>Jen Trification</h6>
                      <p className="mb-0">42 friends</p>
                    </div>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                      <Link to="#" className="me-3 btn btn-primary rounded">
                        <i className="ri-user-add-line me-1"></i>Add Friend
                      </Link>
                      <Link
                        to="#"
                        onClick={questionAlert}
                        className="btn btn-secondary rounded"
                        data-extra-toggle="delete"
                        data-closest-elem=".item"
                      >
                        Remove
                      </Link>
                    </div>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FriendReqest;
