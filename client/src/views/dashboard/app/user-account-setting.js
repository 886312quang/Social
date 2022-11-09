import React, { useState, useCallback, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Image,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import authSelectors from "../../../store/_selectors/auth";
import authActions from "../../../store/_actions/auth";

const UserAccountSetting = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const enable2FA = useSelector(authSelectors.selectEnable2FA);
  const [toggle, setToggle] = useState(enable2FA);
  console.log("toggle", toggle);

  const qrcode = useSelector(authSelectors.selectQRFA);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onToggle = useCallback(() => {
    setToggle(!toggle);
    dispatch(authActions.toggle2FA());
    if (enable2FA) handleShow();
  }, [toggle, enable2FA]);

  return (
    <>
      <Container>
        <Row>
          <Col lg="6">
            <Card>
              <Card.Header className="card-header d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Account Setting</h4>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="acc-edit">
                  <Form>
                    <Form.Group className="form-group">
                      <Form.Label className="d-block form-label">
                        2FA:
                      </Form.Label>
                      <Form.Check
                        style={{ cursor: "pointer" }}
                        className="form-check form-check-inline"
                      >
                        <Form.Check.Input
                          type="checkbox"
                          className="form-check-input"
                          id="english"
                          defaultChecked={enable2FA}
                          onChange={onToggle}
                          style={{ cursor: "pointer" }}
                        />
                        <Form.Check.Label
                          className="form-check-label"
                          htmlFor="english"
                          style={{ cursor: "pointer" }}
                        >
                          Enable
                        </Form.Check.Label>
                      </Form.Check>
                    </Form.Group>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="6">
            <Card>
              <Card.Header className="card-header d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Social Media</h4>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="acc-edit">
                  <Form>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="facebook" className="form-label">
                        Facebook:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="facebook"
                        defaultValue="www.facebook.com"
                      />
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="twitter" className="form-label">
                        Twitter:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="twitter"
                        defaultValue="www.twitter.com"
                      />
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="google" className="form-label">
                        Google +:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="google"
                        defaultValue="www.google.com"
                      />
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="instagram" className="form-label">
                        Instagram:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="instagram"
                        defaultValue="www.instagram.com"
                      />
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="youtube" className="form-label">
                        You Tube:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="youtube"
                        defaultValue="www.youtube.com"
                      />
                    </Form.Group>
                    <Button type="submit" className="btn btn-primary me-2">
                      Submit
                    </Button>
                    <Button type="reset" className="btn bg-soft-danger">
                      Cancel
                    </Button>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal show={show && qrcode} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>QR CODE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card-header d-flex justify-content-center">
            <Image src={qrcode} width="160" alt="" className="card-title" />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserAccountSetting;
