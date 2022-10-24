import { Button, Layout, Row } from "antd";
import React, { useEffect } from "react";
import { ArrowLeft, Info, Video, Shield } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AvatarCus from "../../components/Commons/AvatarCus";
import * as constantLayout from "../../constants/layout";
import { emitCheckListenerStatus } from "../../sockets/call";

import callSelectors from "../../_selectors/call";
import layoutSelectors from "../../_selectors/layout";
import selectors from "../../_selectors/message";
import userSelectors from "../../_selectors/user";
import { textAbstract } from "../Shared/helper";

const { Header } = Layout;

function ChatWidgetHeader() {
  const dispatch = useDispatch();

  // Selector
  const record = useSelector(selectors.selectRecord);
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const peerId = useSelector(callSelectors.selectPeerId);
  const isMobileDevice = useSelector(layoutSelectors.selectIsMobileDevice);

  const handleCallVideoClick = async () => {
    // Step 01. Check user
    let caller = {
      id: currentUser._id,
      userName: currentUser.userName,
      avatar: currentUser.avatar,
    };
    let listener = {
      id: record._id,
      userName: record.userName,
      avatar: record.avatar,
      address: record.address,
      phone: record.phone,
    };
    emitCheckListenerStatus({ caller, listener });
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.3rem 2rem",
        zIndex: "1",
        boxShadow: "0 2px 2px rgba(0, 0, 0, 0.02), 0 1px 0 rgba(0, 0, 0, 0.02)",
        height: "auto",
        lineHeight: "auto",
        backgroundColor: "#fff",
      }}
    >
      <Row type="flex" align="middle">
       

        <AvatarCus record={record ? record : null} />

        <span className="ml-3" style={{ lineHeight: "1" }}>
          <span style={{ display: "block" }}>
            {record
              ? record.members
                ? isMobileDevice
                  ? textAbstract(record.userName, 25)
                  : record.name
                : record.userName
              : ""}
          </span>
        </span>
      </Row>
      <span className="mr-auto" />
      <div>
        <Link to="/newscovid">
          <Button style={{ border: "0" }}>
            <Shield size={20} strokeWidth={2} color="#4cd137" />
          </Button>
        </Link>
        {record && record.conversationType !== "ChatGroup" && (
          <>
            <Button
              style={{ border: "0" }}
              shape="circle"
              onClick={handleCallVideoClick}
            >
              <Video size={20} strokeWidth={1} />
            </Button>
          </>
        )}
        <Button
          style={{ border: "0" }}
          shape="circle"
          onClick={() =>
            dispatch({ type: constantLayout.LAYOUT_RIGHT_SIDEBAR_TOGGLE })
          }
        >
          <Info size={20} strokeWidth={1} />
        </Button>
      </div>
    </Header>
  );
}

export default ChatWidgetHeader;
