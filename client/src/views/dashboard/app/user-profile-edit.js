import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Nav,
} from "react-bootstrap";

//image
import ChangePassword from "./UserInfo/changePassword";
import UserInfo from "./UserInfo/userInfo";

const UserProfileEdit = () => {
  return (
    <>
      <Container>
        <Tab.Container defaultActiveKey="first">
          <Row>
            <Col lg="12">
              <Card>
                <Card.Body className="p-0">
                  <div>
                    <Nav
                      as="ul"
                      variant="pills"
                      className="iq-edit-profile row"
                    >
                      <Nav.Item as="li" className="col-md-6 p-0">
                        <Nav.Link eventKey="first" role="button">
                          Personal Information
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="col-md-6 p-0">
                        <Nav.Link eventKey="second" role="button">
                          Change Password
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={12}>
              {/* <div className="iq-edit-list-data"> */}
              <Tab.Content>
                <Tab.Pane eventKey="first" className="fade show">
                  <UserInfo />
                </Tab.Pane>
                <Tab.Pane eventKey="second" className="fade show">
                  <ChangePassword />
                </Tab.Pane>
              </Tab.Content>
              {/* </div> */}
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  );
};

export default UserProfileEdit;
