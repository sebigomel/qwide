import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import server from "../Config/axios";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [signupData, setSignupData] = useState({ admin: false });
  let navigate = useNavigate();

  useEffect(() => {
    try {
      const response = server.get("/user");
      if (response.redirectUrl) navigate(response.redirectUrl);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleAlertClose = () => {
    let copyOfObject = { ...signupData };
    delete copyOfObject["error"];

    setSignupData((prevData) => ({
      ...copyOfObject,
    }));
  };
  const handleChange = (value, name) => {
    let updatedValue = {};
    updatedValue[name] = value;
    setSignupData((prevData) => ({
      ...prevData,
      ...updatedValue,
    }));
  };
  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      const response = await server.post("/user", signupData);
      console.log(response.status, response.data);
      navigate("/");
    } catch (err) {
      let updatedValue = {};
      updatedValue = { error: err.response.data.message };
      setSignupData((prevData) => ({
        ...prevData,
        ...updatedValue,
      }));
      setTimeout(() => handleAlertClose(), 4000);
    }
  };
  return (
    <div className="auth-container">
      <h3>Create your account</h3>
      <Form onSubmit={handleSignup}>
        <Form.Check
          defaultChecked={signupData.admin}
          type="switch"
          id="custom-switch"
          label="Admin"
          name="admin"
          onChange={(e) => handleChange(e.target.checked, e.target.name)}
        />
        <Form.Group className="mb-3" controlId="signupControl">
          <FloatingLabel label="Email Adress" className="login-input">
            <Form.Control
              name="email"
              type="email"
              placeholder="name@example.com"
              size="lg"
              onChange={(e) => handleChange(e.target.value, e.target.name)}
            />
          </FloatingLabel>
          <FloatingLabel label="New Password" className="login-input">
            <Form.Control
              name="password"
              type="password"
              placeholder="password"
              size="lg"
              onChange={(e) => handleChange(e.target.value, e.target.name)}
            />
          </FloatingLabel>
        </Form.Group>
        <Button as="input" type="submit" value="Submit" />
        <Link to="/">Already have an account? Login</Link>
        {signupData.error && (
          <Alert variant="danger" onClose={handleAlertClose} dismissible>
            {signupData.error}
          </Alert>
        )}
      </Form>
    </div>
  );
}
