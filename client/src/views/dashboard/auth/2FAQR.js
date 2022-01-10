import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Container, Image, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import userActions from "../../../store/_actions/user";
import authActions from "../../../store/_actions/auth";
import selectors from "../../../store/_selectors/auth";
import userSelectors from "../../../store/_selectors/user";
import * as constants from "../../../constants/auth";
import { useDispatch, useSelector } from "react-redux";
import * as ReactDOM from "react-dom";
import notify from "../../../components/notifications/notifications";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Autoplay } from "swiper";

// Import Swiper styles
import "swiper/swiper-bundle.min.css";
import "swiper/components/navigation/navigation.scss";

//image
import mail from "../../../assets/images/login/mail.png";
import logo from "../../../assets/images/logo-full.png";
import login1 from "../../../assets/images/login/1.png";
import login2 from "../../../assets/images/login/2.png";
import login3 from "../../../assets/images/login/3.png";

// install Swiper modules
SwiperCore.use([Navigation, Autoplay]);

const FAQR = () => {
  let history = useHistory();
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const qrcode = useSelector(selectors.selectQRFA);
  const dispatch = useDispatch();

  const [form, setForm] = useState({});
  const [QR, setQR] = useState("");

  const findFormErrors = () => {
    const { token } = form;
    const newErrors = {};
    if (!token || token === "") newErrors.token = "Token is require!";
    else if (token.length < 6) {
      newErrors.token = "Token is valid!";
    } else newErrors.token = "";
    return newErrors;
  };

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const doSubmit = () => {
    const { token } = form;
    const newErrors = findFormErrors();
    let data = {
      otpToken: token,
    };
    if (newErrors && newErrors.token) {
      notify.warning(newErrors.token);
    } else if (newErrors && newErrors.token) {
      notify.warning(newErrors.token);
    } else dispatch(authActions.postVerify2FA(data));
  };

  const qrcodeEl = useRef(null);

  useEffect(() => {
    // dispatch(socketActions.doConnect());
    dispatch(authActions.postEnable2FA());
    setQR(qrcode);
    if (qrcode) qrcodeEl.current = qrcode;
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
                <h1 className="mt-3 mb-0">2FA Authentication</h1>
                <div className="card-header d-flex justify-content-center">
                  <Image
                    src={qrcode}
                    width="160"
                    alt=""
                    className="card-title"
                  />
                </div>
                
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="validationTooltipEmail">
                    2FA TOKEN
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="mb-0"
                    id="validationTooltipEmail"
                    placeholder="Enter 2FA token"
                    required
                    onChange={(e) => setField("token", e.target.value)}
                    minLength={6}
                    maxLength={6}
                  />
                </Form.Group>
                <div className="d-inline-block w-100">
                  <Button
                    type="button"
                    variant="primary"
                    className="mt-1"
                    onClick={doSubmit}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default FAQR;
