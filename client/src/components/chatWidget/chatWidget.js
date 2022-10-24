import React from "react";
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
import Button from "@restart/ui/esm/Button";
import user1 from "../../assets/images/user/01.jpg";
import user2 from "../../assets/images/user/02.jpg";
import user3 from "../../assets/images/user/03.jpg";
import user4 from "../../assets/images/user/04.jpg";
import user5 from "../../assets/images/user/11.jpg";
import user6 from "../../assets/images/user/12.jpg";

const ChatWidget = () => {
  const minichatWidget = () => {
    document.getElementById("chatWidget").classList.toggle("chat-widget");
    document.body.classList.toggle("chat-widget-close");
  };
  return (
    <>
      <div className="chat-widget-mini" id="chatWidget">
        <div className="chat-widget-panel p-0">
          <Card className="shadow-1 m-0">
            <Card.Header className="border-bottom">
              <div className="header-title">
                <h5 className="mb-0 text-black">UserName</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
          
            </Card.Body>
            <Card.Footer className=" w-100 h-full text-center p-3 absolute bottom-0">
              <div>
                Sign out
                <i className="ri-login-box-line ms-2"></i>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
