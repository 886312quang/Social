import React, { useState, useEffect } from "react";
import { Row, Col, Container, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import actions from "../../../store/_actions/auth";
import selectors from "../../../store/_selectors/auth";
import * as constants from "../../../constants/auth";
import notify from "../../../components/notifications/notifications";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Autoplay } from "swiper";

// Import Swiper styles
import "swiper/swiper-bundle.min.css";
import "swiper/components/navigation/navigation.scss";

//img
import logo from "../../../assets/images/logo-full.png";
import login1 from "../../../assets/images/login/1.png";
import login2 from "../../../assets/images/login/2.png";
import login3 from "../../../assets/images/login/3.png";

// install Swiper modules
SwiperCore.use([Navigation, Autoplay]);

const SignUp = () => {
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [confirmCheck, setConfirmCheck] = useState(false);
  const dispatch = useDispatch();
  const signupLoading = useSelector(selectors.selectSignupLoading);
  const signupError = useSelector(selectors.selectSignupError);

  const handleConfirm = () => {
    setConfirmCheck(!confirmCheck);
  };

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const findFormErrors = () => {
    const { email, password, fullname } = form;
    const newErrors = {};
    if (!fullname || fullname === "")
      newErrors.fullname = "Fullname is require!";
    else if (fullname.length < 4) {
      newErrors.fullname = "Fullname is require!";
    } else newErrors.fullname = "";
    // email errors
    if (!email || email === "") newErrors.email = "Email is require!";
    else if (!validateEmail(email)) {
      newErrors.email = "Valid email address!";
    } else {
      newErrors.email = "";
    }
    // password errors
    if (!password || password === "")
      newErrors.password = "Password is require!";
    else if (password && password.length < 8)
      newErrors.password = "Valid password!";
    else {
      newErrors.password = "";
    }
    return newErrors;
  };

  const doSubmit = () => {
    const { email, password, fullname } = form;
    const newErrors = findFormErrors();
    let data = {
      fullname,
      gender: "male",
      email,
      password,
      confirmPassword: password,
    };
    if (newErrors && newErrors.email) {
      notify.warning(newErrors.email);
    } else if (newErrors && newErrors.password) {
      notify.warning(newErrors.password);
    } else if (!confirmCheck) {
      notify.warning("Vui lòng xác nhận điệu khoản của ứng dung!")
    } else dispatch(actions.doSignup(data));
  };

  const handleSubmit = (event) => {
    const newErrors = findFormErrors();

    // Conditional logic:
    if (Object.keys(newErrors).length > 0) {
      // We got errors!
      setErrors(newErrors);
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  return (
    <>
      <section className="sign-in-page">
        <div id="container-inside">
          <div id="circle-small"></div>
          <div id="circle-medium"></div>
          <div id="circle-large"></div>
          <div id="circle-xlarge"></div>
          <div id="circle-xxlarge"></div>
        </div>
        <Container className="p-0">
          <Row className="no-gutters">
            <Col md="6" className="text-center pt-5">
              <div className="sign-in-detail text-white">
                <Link className="sign-in-logo mb-5" to="#">
                  <Image src={logo} className="img-fluid" alt="logo" />
                </Link>
                <div className="sign-slider overflow-hidden">
                  <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                      delay: 2000,
                      disableOnInteraction: false,
                    }}
                    className="list-inline m-0 p-0 "
                  >
                    <SwiperSlide>
                      <Image
                        src={login1}
                        className="img-fluid mb-4"
                        alt="logo"
                      />
                      <h4 className="mb-1 text-white">Find new friends</h4>
                      <p>
                        It is a long established fact that a reader will be
                        distracted by the readable content.
                      </p>
                    </SwiperSlide>
                    <SwiperSlide>
                      <Image
                        src={login2}
                        className="img-fluid mb-4"
                        alt="logo"
                      />
                      <h4 className="mb-1 text-white">
                        Connect with the world
                      </h4>
                      <p>
                        It is a long established fact that a reader will be
                        distracted by the readable content.
                      </p>
                    </SwiperSlide>
                    <SwiperSlide>
                      <Image
                        src={login3}
                        className="img-fluid mb-4"
                        alt="logo"
                      />
                      <h4 className="mb-1 text-white">Create new events</h4>
                      <p>
                        It is a long established fact that a reader will be
                        distracted by the readable content.
                      </p>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </Col>
            <Col md="6" className="bg-white pt-5 pt-5 pb-lg-0 pb-5">
              <div className="sign-in-from">
                <h1 className="mb-0">Sign Up</h1>
                <p>
                  Enter your email address and password to access admin panel.
                </p>
                <Form
                  className="mt-4"
                  validated={validated}
                  onClick={handleSubmit}
                >
                  <Form.Group className="form-group">
                    <Form.Label>Your Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="mb-0"
                      id="exampleInputEmail1"
                      placeholder="Your Full Name"
                      required
                      minLength={4}
                      onChange={(e) => setField("fullname", e.target.value)}
                      isInvalid={!!errors.fullname}
                    />
                    {errors.fullname ? (
                      <Form.Control.Feedback tooltip type="invalid">
                        {errors.fullname}
                      </Form.Control.Feedback>
                    ) : null}
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      className="mb-0"
                      id="exampleInputEmail2"
                      placeholder="Enter email"
                      required
                      onChange={(e) => setField("email", e.target.value)}
                      isInvalid={!!errors.email}
                    />
                    {errors.email ? (
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    ) : null}
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      className="mb-0"
                      id="exampleInputPassword1"
                      placeholder="Password"
                      required
                      minLength={8}
                      onChange={(e) => setField("password", e.target.value)}
                      isInvalid={!!errors.password}
                    />
                    {errors.password ? (
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    ) : null}
                  </Form.Group>
                  <div className="d-inline-block w-100">
                    <Form.Check className="d-inline-block mt-2 pt-1">
                      <Form.Check.Input
                        type="checkbox"
                        className="me-2"
                        id="customCheck1"
                        checked={confirmCheck}
                        onChange={handleConfirm}
                      />
                      <Form.Check.Label>
                        I accept <Link to="#">Terms and Conditions</Link>
                      </Form.Check.Label>
                    </Form.Check>
                    <Button
                      type="button"
                      className="btn-primary float-end"
                      onClick={doSubmit}
                    >
                      Sign Up
                    </Button>
                  </div>
                  <div className="sign-info">
                    <span className="dark-color d-inline-block line-height-2">
                      Already Have Account ?{" "}
                      <Link to="/auth/sign-in">Log In</Link>
                    </span>
                    <ul className="iq-social-media">
                      <li>
                        <Link to="#">
                          <i className="ri-facebook-box-line"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="ri-twitter-line"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="ri-instagram-line"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SignUp;
