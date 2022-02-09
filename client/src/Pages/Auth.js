import React, { useState, useEffect } from "react";
import styled from "styled-components";
import server from "../Config/axios";
import { useNavigate, Link } from "react-router-dom";
import Input from "../Components/Input";
import { GoogleLogin } from "react-google-login";
import GoogleButton from "react-google-button";

const Button = styled.button`
  background-color: #2f80ed;
  color: #ffffff;
  margin-top: 20px;
  border-radius: 8px;
  width: 28.6em;
  padding: 0.6em;
  border: none;
  font-size: 0.7em;
  font-weight: bold;
`;

const Form = styled.form`
  width: fit-content;
  margin-top: 20px;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const Wrapper = styled.div`
  border: 1px solid #bdbdbd;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3em;
  gap: 20px;

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
  const [formData, setFormData] = useState({});
  let navigate = useNavigate();

  const handleAlertClose = () => {
    let copyOfObject = { ...formData };
    delete copyOfObject["error"];

    setFormData((prevData) => ({
      ...copyOfObject,
    }));
  };

  /*   useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await server.get("/user");
        return response;
      };
      const response = fetchData();
      if (response.data.redirectUrl) navigate(response.data.redirectUrl);
    } catch (err) {
      console.log(err);
    }
  }, [navigate]); */

  const handleChange = (e) => {
    let updatedValue = {};
    updatedValue[e.target.name] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      ...updatedValue,
    }));
  };

  const handleGoogleLogin = async (googleProfile) => {
    console.log(googleProfile);
    server.post("/auth/google", { token: googleProfile.tokenId });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = login
        ? await server.put("/user", formData)
        : await server.post("/user", formData);
      console.log(response.status, response.data);
      navigate("products");
    } catch (err) {
      let updatedValue = {};
      updatedValue = { error: err.response.data.message };
      setFormData((prevData) => ({
        ...prevData,
        ...updatedValue,
      }));
      setTimeout(() => handleAlertClose(), 4000);
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
        <Form>
          <Input
            content="Email"
            logo="email"
            type="email"
            handleChange={handleChange}
          />
          <Input
            content="Password"
            logo="lock"
            type="password"
            handleChange={handleChange}
          />
          <Button>{!login ? "Join now" : "Login"}</Button>
        </Form>
        <p className="helper-text">or continue with these social profile</p>
        <GoogleLogin
          clientId={process.env.REACT_APP_CLIENT_ID}
          onSuccess={handleGoogleLogin}
          onFailure={handleGoogleLogin}
          cookiePolicy={"single_host_origin"}
          render={(renderProps) => (
            <GoogleButton
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              style={{ alignSelf: "center", marginTop: "15px" }}
            />
          )}
        />
        <p className="helper-text">
          {login ? `Don't have an account? ` : "Already a member? "}
          {login ? (
            <Link to={"/signup"}>Login</Link>
          ) : (
            <Link to={"/"}>Register</Link>
          )}
        </p>
      </Wrapper>
    </Container>
  );
}
