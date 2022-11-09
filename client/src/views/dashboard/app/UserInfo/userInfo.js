import { Upload } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import notify from "../../../../components/notifications/notifications";
import { isAuthenticated } from "../../../../router/permissionChecker";
import actions from "../../../../store/_actions/user";
import userSelectors from "../../../../store/_selectors/user";
import * as constants from "../../../../constants/user";

export default function UserInfo({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const [imageUrl, setImageUrl] = useState(
    currentUser?.avatar ? currentUser.avatar : ""
  );

  const action = `${process.env.REACT_APP_API_URI}/user/updateAvatar`;

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  let getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const findFormErrors = () => {
    const { userName } = form;
    const newErrors = {};
    // password errors
    if (!userName || userName === "")
      newErrors.userName = "Username is require!";
    else if (userName && userName.length < 3)
      newErrors.userName = "Valid Username!";
    else {
      newErrors.userName = "";
    }
    return newErrors;
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

  const doSubmit = () => {
    const newErrors = findFormErrors();
    let data = {
      ...form,
    };

    console.log("data", data);
    dispatch(actions.doUpdateInfo(data));
    /* if (newErrors && newErrors.userName) {
      notify.warning(newErrors.userName);
    } else  */
  };

  let beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      notify.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notify.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  let handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    /*  if (record && record.members) {
      dispatch({
        type: constantsMessages.GROUP_CHANGE_AVATAR,
        payload: { avatar: info.file.response.imageSrc, id: record._id },
      });
      dispatch(
        actions.doCreate({
          type: "notification",
          message: `${currentUser.userName} changed the group avatar`,
          receiverId: record._id,
          sender: currentUser._id,
          conversationType: "ChatGroup",
          isChatGroup: true,
          members: record.members,
        }),
      );
      emitChangeAvatarGroup({
        avatar: info.file.response.imageSrc,
        members: record.members,
        id: record._id,
      });
    } else if (!record || (record && record.userName)) {
      dispatch({
        type: constants.USER_CHANGE_AVATAR,
        payload: info.file.response.imageSrc,
      });
    } */
    if (info.file.status === "done") {
      notify.success("Cập nhật ảnh đại diện thành công!")
      // Get this url from response in real world.
      if (info.file.response.imageSrc) {
        console.log(info.file.response);
        setImageUrl(info.file.response?.imageSrc);
        let avatar = info.file.response?.imageSrc;
        dispatch({
          type: constants.USER_UPDATE_AVATAR,
          payload: avatar,
        });
      }
    } else {
      notify.warning("Cập nhật ảnh đại diện thất bại!")
    }
  };    
   
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <div className="header-title">
          <h4 className="card-title">Personal Information</h4>
        </div>
      </Card.Header>
      <Card.Body>
        <Form onClick={handleSubmit}>
          <Form.Group className="form-group align-items-center">
            <Col md="12">
              <div className="profile-img-edit">
                <img
                  className="profile-pic"
                  src={
                    currentUser
                      ? process.env.REACT_APP_STATIC_AVATARS + "/" + imageUrl
                      : ""
                  }
                  alt="profile-pic"
                />
                <div className="p-image">
                  <Upload
                    name="avatar"
                    listType="avatar-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={action}
                    headers={{
                      Authorization: "Bearer " + isAuthenticated(),
                      "x-access-token": isAuthenticated(),
                    }}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    <i className="ri-pencil-line upload-button text-white"></i>
                    <input
                      className="file-upload"
                      type="file"
                      accept="image/*"
                    />
                  </Upload>
                </div>
              </div>
            </Col>
          </Form.Group>
          <Row className="align-items-center">
            <Form.Group className="form-group col-sm-6">
              <Form.Label htmlFor="fname" className="form-label">
                User Name:
              </Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                id="fname"
                defaultValue={currentUser?.userName}
                required
                onChange={(e) => setField("userName", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="form-group col-sm-6">
              <Form.Label htmlFor="dob" className="form-label">
                Date Of Birth:
              </Form.Label>
              <Form.Control
                className="form-control"
                id="dob"
                defaultValue={currentUser?.birth}
                onChange={(e) => setField("birth", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="form-group col-sm-6">
              <Form.Label className="form-label d-block">Gender:</Form.Label>
              <Form.Check className="form-check form-check-inline">
                <Form.Check.Input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio10"
                  defaultChecked={currentUser?.gender == "male"}
                  onChange={(e) => setField("gender", "male")}
                />
                <Form.Check.Label
                  className="form-check-label"
                  htmlFor="inlineRadio10"
                >
                  {" "}
                  Male
                </Form.Check.Label>
              </Form.Check>
              <Form.Check className="form-check form-check-inline">
                <Form.Check.Input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio11"
                  defaultChecked={currentUser?.gender == "female"}
                  onChange={(e) => setField("gender", "female")}
                />
                <Form.Check.Label
                  className="form-check-label"
                  htmlFor="inlineRadio11"
                >
                  Female
                </Form.Check.Label>
              </Form.Check>
            </Form.Group>

            <Form.Group className="form-group col-sm-12">
              <Form.Label className="form-label">Address:</Form.Label>
              <Form.Control
                as="textarea"
                className="form-control"
                rows={5}
                style={{ lineHeight: "22px" }}
                defaultValue={currentUser?.address}
                onChange={(e) => setField("address", e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Row>
          <Button onClick={doSubmit} className="btn btn-primary me-2">
            Submit
          </Button>
          <Button type="reset" className="btn bg-soft-danger">
            Cancel
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
