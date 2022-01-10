import React, { useEffect, useState } from "react";
import { Row, Col, Container, Form, Button, Image } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
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

const ChangePassword = () => {
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const loading = useSelector(selectors.selectChangePasswordLoading);
  const error = useSelector(selectors.selectChangePasswordError);

  const query = useQuery();

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const findFormErrors = () => {
    const { password, confirmPassword } = form;
    const newErrors = {};
    // password errors
    if (!password || password === "")
      newErrors.password = "Password is require!";
    else if (password && password.length < 8)
      newErrors.password = "Valid password!";
    else {
      newErrors.password = "";
    }

    // password errors
    if (!confirmPassword || confirmPassword === "")
      newErrors.confirmPassword = "ConfirmPassword is require!";
    else if (confirmPassword && confirmPassword.length < 8)
      newErrors.confirmPassword = "Valid confirmPassword!";
    else {
      newErrors.confirmPassword = "";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password does not match!";
    }
    return newErrors;
  };

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const doSubmit = () => {
    const { password, confirm } = form;
    const email = query.get("email");
    const resetToken = query.get("resetToken");
    const newErrors = findFormErrors();
    let data = {
      password,
      confirm,
    };
    if (newErrors && newErrors.email) {
      notify.warning(newErrors.email);
    } else if (newErrors && newErrors.password) {
      notify.warning(newErrors.password);
    } else dispatch(actions.doChangePassword({ ...data, email, resetToken }));
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

  useEffect(() => {
    dispatch(actions.doInitLoadingDone());
  }, []);

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
                <div className="sign-slider overflow-hidden ">
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
                <h1 className="mb-0">Change Password</h1>
                <p>Enter your new password.</p>
                <Form
                  className="mt-4 needs-validation"
                  noValidate
                  validated={validated}
                  onClick={handleSubmit}
                >
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="validationTooltipEmail">
                      New password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      className="mb-0"
                      id="validationTooltipEmail"
                      placeholder="Enter email"
                      required
                      onChange={(e) => setField("password", e.target.value)}
                      isInvalid={!!errors.password}
                    />
                    {errors.password ? (
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      className="mb-0"
                      id="exampleInputPassword1"
                      placeholder="Cornfirm Password"
                      onChange={(e) =>
                        setField("confirmPassword", e.target.value)
                      }
                      required
                      minLength={8}
                      isInvalid={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword ? (
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    ) : null}
                  </Form.Group>
                  <div className="d-inline-block w-100">
                    <Button
                      variant="primary"
                      className="float-end"
                      onClick={doSubmit}
                    >
                      Confirm
                    </Button>
                  </div>
                  <div className="sign-info">
                    <span className="dark-color d-inline-block line-height-2">
                      Don't have an account?{" "}
                      <Link to="/auth/sign-up">Sign up</Link>
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

export default ChangePassword;
