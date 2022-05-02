import React, { useState } from "react";
import styled from "styled-components";
import server from "../config/axios";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/Input";
import { GoogleLogin } from "react-google-login";
import GoogleButton from "react-google-button";
import UserContext from "../contexts/userContext";

const Alert = styled.div`
  background-color: #ff5f5f;
  padding: 8px;
  border-radius: 8px;
  font-size: 0.7em;
  display: flex;
  gap: 15px;

  span {
    font-size: 1.5em;
  }
`;

const Button = styled.button`
  background-color: #5b4bdf;
  color: #ffffff;
  margin-top: 20px;
  border-radius: 8px;
  width: 28.6em;
  padding: 0.6em;
  border: none;
  font-size: 0.7em;
`;

const Form = styled.form`
  width: fit-content;
  margin-top: 20px;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;
  align-items: flex-start;

  @media only screen and (min-width: 500px) {
    align-items: center;
  }
`;

const Wrapper = styled.div`
  border: 1px solid #bdbdbd;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3em;
  gap: 1em;

  @media only screen and (max-width: 500px) {
    border: none;
  }

  p {
    font-size: 0.7em;
    align-self: center;
    color: #828282;
    margin: 0;
    margin-top: 30px;
  }

  a {
    color: #2f80ed;
  }
`;

const Title = styled.h4`
  font-weight: ${(props) => props.fontWeight || "bold"};
  font-family: "Noto Sans";
  margin: 0;
  max-width: 430px;
`;

export default function Auth({ login }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  let navigate = useNavigate();
  const { user, setUser } = React.useContext(UserContext);

  React.useEffect(() => {
    if (user !== "Unknown") return navigate("/");
  }, [user, navigate]);

  const handleAlertClose = () => {
    let copyOfObject = { ...formData };
    delete copyOfObject["error"];

    setFormData((prevData) => ({
      ...copyOfObject,
    }));
  };

  const handleChange = (e) => {
    let updatedValue = {};
    updatedValue[e.target.name] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      ...updatedValue,
    }));
  };

  const handleGoogleLogin = async (googleProfile) => {
    try {
      const response = await server.post("/user/google", {
        token: googleProfile.tokenId,
      });
      setUser(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setFormData({ email: "", password: "" });
      const response = login
        ? await server.put("/user", formData)
        : await server.post("/user", formData);
      if (login) {
        setUser(response.data);
      }
      login ? navigate("/dashboard") : navigate("/");
    } catch (err) {
      let updatedValue = {};
      updatedValue = { error: err.response.data.message };
      setFormData((prevData) => ({
        ...prevData,
        ...updatedValue,
      }));
      setTimeout(() => handleAlertClose(), 5000);
    }
  };
  return (
    <Container>
      <Wrapper>
        <img src="logo.png" alt="" width="130px" height="auto" />
        <Title>
          {login ? "Login" : "Join the best project management platform ever"}
        </Title>
        {!login && (
          <Title fontWeight="normal" as="h5">
            Stop wasting time with this real time service for workflow
            management
          </Title>
        )}
        <Form onSubmit={handleSubmit}>
          <Input
            value={formData.email}
            content="Email"
            logo="email"
            type="email"
            handleChange={handleChange}
          />
          <Input
            value={formData.password}
            content="Password"
            logo="lock"
            type="password"
            handleChange={handleChange}
          />
          <Button>{!login ? "Join now" : "Login"}</Button>
        </Form>
        {formData.error && (
          <Alert>
            <span className="material-icons">warning</span>
            <div>{formData.error}</div>
          </Alert>
        )}

        <p className="helper-text">or continue with these social profile</p>
        <GoogleLogin
          clientId={process.env.REACT_APP_CLIENT_ID}
          onSuccess={handleGoogleLogin}
          onFailure={handleGoogleLogin}
          cookiePolicy={"single_host_origin"}
          render={(renderProps) => (
            <GoogleButton
              type="light"
              label={login ? "Sign in with Google" : "Sign up with Google"}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              style={{
                alignSelf: "center",
                marginTop: "15px",
                width: "100%",
                fontSize: "0.75em",
                fontWeight: "500",
              }}
            />
          )}
        />
        <p className="helper-text">
          {login ? `Don't have an account? ` : "Already a member? "}
          {login ? (
            <Link to={"/signup"}>Register</Link>
          ) : (
            <Link to={"/"}>Login</Link>
          )}
        </p>
      </Wrapper>
    </Container>
  );
}
