import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import notify from "../../../../components/notifications/notifications";
import actions from "../../../../store/_actions/user";

const ChangePassword = () => {
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const findFormErrors = () => {
    const { currentPassword, newPassword, confirm } = form;
    const newErrors = {};
    // password errors
    if (!currentPassword || currentPassword === "")
      newErrors.currentPassword = "Current Password is require!";
    else if (currentPassword && currentPassword.length < 8)
      newErrors.currentPassword = "Valid current Password!";
    else {
      newErrors.currentPassword = "";
    }

    // password errors
    if (!newPassword || newPassword === "")
      newErrors.newPassword = "ConfirmPassword is require!";
    else if (newPassword && newPassword.length < 8)
      newErrors.newPassword = "Valid newPassword!";
    else {
      newErrors.newPassword = "";
    }

    // password errors
    if (!confirm || confirm === "")
      newErrors.confirm = "Confirm Password is require!";
    else if (confirm && confirm.length < 8)
      newErrors.confirm = "Valid new password confirm!";
    else {
      newErrors.confirm = "";
    }

    if (confirm != newPassword) {
      newErrors.confirm = "New password confirm does not match!";
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
    const { currentPassword, newPassword, confirm } = form;
    const newErrors = findFormErrors();
    let data = {
      currentPassword,
      newPassword,
      confirm,
    };
    if (newErrors && newErrors.currentPassword) {
      notify.warning(newErrors.currentPassword);
    } else if (newErrors && newErrors.newPassword) {
      notify.warning(newErrors.newPassword);
    } else if (newErrors && newErrors.confirm) {
      notify.warning(newErrors.confirm);
    } else dispatch(actions.doUpdatePassword(data));
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <div className="iq-header-title">
          <h4 className="card-title">Change Password</h4>
        </div>
      </Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onClick={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label
              htmlFor="validationTooltipCurrentPassword"
              className="form-label"
            >
              Current Password:
            </Form.Label>
            <Form.Control
              type="password"
              className="form-control"
              id="validationTooltipCurrentPassword"
              required
              onChange={(e) => setField("currentPassword", e.target.value)}
              isInvalid={!!errors?.currentPassword}
            />
            {errors.currentPassword ? (
              <Form.Control.Feedback type="invalid">
                {errors?.currentPassword}
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label htmlFor="npass" className="form-label">
              New Password:
            </Form.Label>
            <Form.Control
              type="password"
              className="form-control"
              id="npass"
              required
              onChange={(e) => setField("newPassword", e.target.value)}
              isInvalid={!!errors?.newPassword}
            />
            {errors.newPassword ? (
              <Form.Control.Feedback type="invalid">
                {errors?.newPassword}
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label htmlFor="vpass" className="form-label">
              Verify Password:
            </Form.Label>
            <Form.Control
              type="password"
              className="form-control"
              id="vpass"
              required
              onChange={(e) => setField("confirm", e.target.value)}
              isInvalid={!!errors?.confirm}
            />
            {errors.confirm ? (
              <Form.Control.Feedback type="invalid">
                {errors?.confirm}
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
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
};

export default ChangePassword;
