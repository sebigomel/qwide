import React, { useState, useEffect } from "react";
import styled from "styled-components";
import server from "../Config/axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const Wrapper = styled.div`
  height: fit-content;
  width: fit-content;
  border: 1px solid #bdbdbd;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  padding: 60px;

  & h2,
  h3 {
    font-weight: bold;
    font-family: "Noto Sans";
    white-space: pre-line;
    margin: 10px 0;
  }
  h3 {
    font-weight: normal;
  }
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

  useEffect(() => {
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
  }, [navigate]);

  const handleChange = (e) => {
    let updatedValue = {};
    updatedValue[e.target.name] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      ...updatedValue,
    }));
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await server.put("/user", formData);
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
        <img src="logo.png" alt="" width="100px" height="auto" />
        <h2>
          {login ? "Login" : `Join the best project management \nplatform ever`}
        </h2>
        {!login && (
          <h3>
            Stop wasting time in organizing and contacting <br /> your employees
            with this real time service
            <br /> for workflow management
          </h3>
        )}
      </Wrapper>
    </Container>
  );
}
